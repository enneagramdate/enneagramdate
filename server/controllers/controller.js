import 'dotenv/config';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from 'uuid';
import neo4j from 'neo4j-driver';
import { hash, compare } from 'bcrypt';
import jwt from 'jsonwebtoken';
import { dictionary, getAge, addressToPos } from '../utils.js';
import { point } from '@turf/helpers';
import distance from '@turf/distance';

const apiController = {};

// Store user-uploaded images in S3 bucket

apiController.storeUploadedMedia = async (req, res, next) => {
  try {
    // instantiate a new S3 client
    const s3 = new S3Client({
      credentials: {
        accessKeyId: process.env.ACCESS_KEY,
        secretAccessKey: process.env.SECRET_ACCESS_KEY,
      },
      region: process.env.BUCKET_REGION,
    });

    // destructure req.file for upload data and metadata
    const { mimetype, buffer } = req.file;

    // instead of upload filename (req.file.originalname), using a uuid to avoid media upload naming collisions on S3 (i.e. uploads with same filename are overwritten)
    const uploadKey = uuidv4();

    // call S3 client's send method to put uploaded file into S3 bucket (no need to store result)
    await s3.send(
      new PutObjectCommand({
        Bucket: process.env.BUCKET_NAME,
        Key: uploadKey,
        // image type (i.e. photo - image/jpeg, gif, video)
        ContentType: mimetype,
        // buffer = image data
        Body: buffer,
      })
    );

    // it's AWS S3 best practice to use pre-signed, temporarily available URLs
    // using PutObjectCommand as the argument generates a URL but that URL doesn't work
    const s3UploadUrl = await getSignedUrl(
      s3,
      new GetObjectCommand({
        Bucket: process.env.BUCKET_NAME,
        Key: uploadKey,
      }),
      { expiresIn: 604800 } // 1 week
    );

    // persist upload's S3 URL to createNewUserNode middleware
    res.locals.s3UploadUrl = s3UploadUrl;
    return next();
  } catch (err) {
    return next({
      log: `storeUploadedMedia connection error\n${err}\nCause: ${err.cause}`,
      status: 500,
      message: {
        err: 'Error uploading photo',
      },
    });
  }
};

// Create a new User node

apiController.createNewUserNode = async (req, res, next) => {
  try {
    // creating a driver instance provides info on how to access the DB; connection is deferred to when the first query is executed
    const driver = neo4j.driver(
      process.env.NEO4J_URI,
      neo4j.auth.basic(process.env.NEO4J_USERNAME, process.env.NEO4J_PASSWORD)
    );

    // verify the driver can connect to the DB
    const serverInfo = await driver.getServerInfo();
    console.log(`Connection established, serverInfo: ${serverInfo}`);

    // use the driver to run queries
    // destructure req body fields and image URL from res.locals for the DB query
    const {
      email,
      password,
      fullName,
      enneagramType,
      birthday,
      gender,
      seekGender,
      seekRelationship,
      location,
      seekRadius,
    } = req.body;

    // formData passes this as str1,str2, and BE is processing as [num1, num2]
    let seekAgeRange = req.body.seekAgeRange.split(',');
    seekAgeRange = seekAgeRange.map((str) => Number(str));

    const { s3UploadUrl } = res.locals;

    // if a User with a matching email already exists, throw an Error
    const existingUser = await driver.executeQuery(
      'MATCH (u:User WHERE u.email=$email) RETURN u',
      {
        email,
      },
      { database: 'neo4j' }
    );

    if (existingUser.records[0]) {
      throw new Error(
        'A new user was not created because a user with this email already exists.'
      );
    }
    // if not, hash the provided password
    const hashedPassword = await hash(
      password,
      Number(process.env.SALT_ROUNDS)
    );

    const { lat, lng } = await addressToPos(location); // example location: { lat: 45.4438861, lng: -75.6930623 }

    const newUserNode = await driver.executeQuery(
      'MERGE (u:User {email: $email}) ON CREATE SET u.password=$hashedPassword, u.fullName=$fullName, u.enneagramType=$enneagramType, u.birthday=$birthday, u.seekAgeRange=$seekAgeRange, u.gender=$gender, u.seekGender=$seekGender, u.seekRelationship=$seekRelationship, u.lat=$lat, u.lng=$lng, u.seekRadius=$seekRadius, u.s3UploadUrl=$s3UploadUrl RETURN u',
      {
        email,
        hashedPassword,
        fullName,
        enneagramType,
        birthday,
        seekAgeRange,
        gender,
        seekGender,
        seekRelationship,
        lat,
        lng,
        seekRadius,
        s3UploadUrl,
      },
      { database: 'neo4j' }
    );

    // close driver to free allocated resources
    await driver.close();

    // persist the User node and signed JWT for the session
    res.locals.user = newUserNode;
    res.locals.token = jwt.sign(
      newUserNode.records[0]._fields[0].elementId,
      process.env.JWT_SECRET
    );
    return next();
  } catch (err) {
    return next({
      log: `createNewUserNode connection error\n${err}\nCause: ${err.cause}`,
      status: 500,
      message: {
        err: err.message,
      },
    });
  }
};

// For the new User node, create RECOMMENDED_FOR relationships with all other compatible partners in DB

apiController.createNewUserRecommendations = async (req, res, next) => {
  try {
    const driver = neo4j.driver(
      process.env.NEO4J_URI,
      neo4j.auth.basic(process.env.NEO4J_USERNAME, process.env.NEO4J_PASSWORD)
    );

    const serverInfo = await driver.getServerInfo();
    console.log(`Connection established, serverInfo: ${serverInfo}`);

    // from here:
    // User A = signed up / in User
    // User B = another User in DB

    // destructure User A's info persisted via res.locals
    const {
      email,
      enneagramType,
      birthday,
      seekAgeRange,
      gender,
      seekGender,
      seekRelationship,
      lat,
      lng,
      seekRadius,
    } = res.locals.user.records[0]._fields[0].properties;

    // store all existing Users that are NOT the newly created User
    let allOtherUsers = await driver.executeQuery(
      'MATCH (u:User WHERE u.email <> $email) RETURN u',
      {
        email,
      },
      { database: 'neo4j' }
    );
    // parse for just the user's properties (i.e. form info they provided on signup)
    allOtherUsers = allOtherUsers.records.map(
      (record) => record._fields[0].properties
    );

    // get User A's Set of compatible types
    const compatibleTypesForA = dictionary.get(enneagramType);
    // get User A's age
    const userAAge = getAge(birthday);
    // get User A's geolocation
    const userALocation = point([lng, lat]);
    console.log(userALocation);
    // iterate over all User nodes that are NOT User A
    for (const userB of allOtherUsers) {
      // get User B's age
      const userBAge = getAge(userB.birthday);
      // get User B's location, then calculate distance between A and B
      const userBLocation = point([userB.lng, userB.lat]);
      const distanceAToB = distance(userALocation, userBLocation, {
        units: 'miles',
      });

      // do compatibility checks between A and B (and vice versa) to ensure mutual compatibility before creating mutual RECOMMENDED_FORs
      if (
        // check B's enneagramType is in A's compatible types Set
        compatibleTypesForA.has(userB.enneagramType) &&
        // check B's age falls in A's seekAgeRange
        seekAgeRange[0] <= userBAge &&
        userBAge <= seekAgeRange[1] &&
        // check B's gender matches A's seekGender
        seekGender === userB.gender &&
        // check B's seekRel matches A's seekRel
        seekRelationship === userB.seekRelationship &&
        // check B's location is in A's seekRadius
        distanceAToB <= seekRadius &&
        // Note: We've already confirmed compatibilities are MUTUAL. If User A's compatible types Set contains User B's enneagram type, vice versa is also true, so we don't need to check both ways.
        // check A's age falls in B's seekAgeRange
        userB.seekAgeRange[0] <= userAAge &&
        userAAge <= userB.seekAgeRange[1] &&
        // check A's gender matches B's seekGender
        userB.seekGender === gender &&
        // Note: We've already onfirmed A's and B's seekRelationships match.
        // check A's location is in B's seekRadius
        distanceAToB <= userB.seekRadius
      ) {
        // if all checks are met, create RECOMMENDED_FOR relationships both ways
        // Issue: "RETURN rAtoB, rBtoA" clause returns only the last pair of relationships created (i.e. if 6 are created, ids 4 and 5 are returned), but the query does update DB correctly. Fix: Send the relationships to FE in the next controller.
        const newUserRecommendations = await driver.executeQuery(
          'MATCH (a:User WHERE a.email=$email) MATCH (b:User WHERE b.email=$emailB) MERGE (a)-[rAtoB:RECOMMENDED_FOR]->(b) MERGE (a)<-[rBtoA:RECOMMENDED_FOR]-(b)',
          {
            email,
            emailB: userB.email,
          },
          { database: 'neo4j' }
        );
      }
    }

    await driver.close();

    return next();
  } catch (err) {
    return next({
      log: `createNewUserRecommendations connection error\n${err}\nCause: ${err.cause}`,
      status: 500,
      message: {
        err: err.message,
      },
    });
  }
};

// Use login credentials to verify if User exists or not

apiController.verifyUserExists = async (req, res, next) => {
  try {
    const driver = neo4j.driver(
      process.env.NEO4J_URI,
      neo4j.auth.basic(process.env.NEO4J_USERNAME, process.env.NEO4J_PASSWORD)
    );

    const serverInfo = await driver.getServerInfo();
    console.log(`Connection established, serverInfo: ${serverInfo}`);

    const { email, password } = req.body;

    const existingUser = await driver.executeQuery(
      'MATCH (u:User WHERE u.email=$email) RETURN u',
      {
        email,
      },
      { database: 'neo4j' }
    );

    await driver.close();

    // if a User with a matching email exists AND the provided password matches saved / hashed password
    if (
      existingUser.records[0] &&
      (await compare(
        password,
        existingUser.records[0]._fields[0].properties.password
      ))
    ) {
      // persist the User node and signed JWT for the session
      res.locals.user = existingUser;
      res.locals.token = jwt.sign(
        existingUser.records[0]._fields[0].elementId,
        process.env.JWT_SECRET
      );
      return next();
    }
    // if no matching User exists OR the provided pw does not matched saved pw, throw an Error
    else {
      throw new Error('Invalid email or password.');
    }
  } catch (err) {
    return next({
      log: `verifyUserExists connection error\n${err}\nCause: ${err.cause}`,
      status: 500,
      message: {
        err: err.message,
      },
    });
  }
};

// return all users B that are recommended for, like, or matched with User A; we don't want to serve up people A is recommended for, likes, dislikes or unmatched

apiController.sendLatestRelationships = async (req, res, next) => {
  try {
    const driver = neo4j.driver(
      process.env.NEO4J_URI,
      neo4j.auth.basic(process.env.NEO4J_USERNAME, process.env.NEO4J_PASSWORD)
    );

    const serverInfo = await driver.getServerInfo();
    console.log(`Connection established, serverInfo: ${serverInfo}`);

    // store the User node's elementId
    const userElId = res.locals.user.records[0]._fields[0].elementId;

    // store all users that are recommended for, like, or matched with User A
    const latestRelationships = await driver.executeQuery(
      'MATCH (a:User WHERE elementId(a)=$userElId)<-[r]-(b:User) RETURN b, r',
      {
        userElId,
      },
      { database: 'neo4j' }
    );

    await driver.close();

    res.locals.latestRelationships = latestRelationships;
    return next();
  } catch (err) {
    return next({
      log: `sendLatestRelationships connection error\n${err}\nCause: ${err.cause}`,
      status: 500,
      message: {
        err: err.message,
      },
    });
  }
};

// STRETCH: User A edits their profile information (replace images, change preferences, etc.)

// User A LIKES User B

apiController.createLikesOrMatch = async (req, res, next) => {
  try {
    const driver = neo4j.driver(
      process.env.NEO4J_URI,
      neo4j.auth.basic(process.env.NEO4J_USERNAME, process.env.NEO4J_PASSWORD)
    );

    const serverInfo = await driver.getServerInfo();
    console.log(`Connection established, serverInfo: ${serverInfo}`);

    // destructure user A's elementId and user B's elementId from POST body
    const { elementIdA, elementIdB } = req.body;

    // check relationship type of B towards A
    const BtoARelationship = await driver.executeQuery(
      'MATCH (a:User WHERE elementId(a)=$elementIdA)<-[r]-(b:User WHERE elementId(b)=$elementIdB) RETURN type(r)',
      {
        elementIdA,
        elementIdB,
      },
      { database: 'neo4j' }
    );
    // if B LIKES A
    if (BtoARelationship.records[0]._fields[0] === 'LIKES') {
      // delete B to A LIKES relationship
      // delete A to B RECOMMENDED_FOR relationship
      // create MATCH relationships for A to B and B to A
      const AmatchesB = await driver.executeQuery(
        'MATCH (a:User WHERE elementId(a)=$elementIdA)-[r]-(b:User WHERE elementId(b)=$elementIdB) DELETE r MERGE (a)-[m:MATCH]->(b) MERGE (a)<-[n:MATCH]-(b) RETURN m, n',
        {
          elementIdA,
          elementIdB,
        },
        { database: 'neo4j' }
      );

      res.locals.AmatchesB = AmatchesB;
    }
    // if B is RECOMMENDED_FOR A
    else if (BtoARelationship.records[0]._fields[0] === 'RECOMMENDED_FOR') {
      // delete A to B RECOMMENDED_FOR relationship
      // create A to B LIKES relationship
      const AlikesB = await driver.executeQuery(
        'MATCH (a:User WHERE elementId(a)=$elementIdA)-[r:RECOMMENDED_FOR]->(b:User WHERE elementId(b)=$elementIdB) MERGE (a)-[l:LIKES]->(b) RETURN l',
        {
          elementIdA,
          elementIdB,
        },
        { database: 'neo4j' }
      );

      res.locals.AlikesB = AlikesB;
    }

    await driver.close();

    return next();
  } catch (err) {
    return next({
      log: `createLikesOrMatch connection error\n${err}\nCause: ${err.cause}`,
      status: 500,
      message: {
        err: err.message,
      },
    });
  }
};

// User A DISLIKES or UNMATCHES User B

apiController.removeRelationships = async (req, res, next) => {
  try {
    const driver = neo4j.driver(
      process.env.NEO4J_URI,
      neo4j.auth.basic(process.env.NEO4J_USERNAME, process.env.NEO4J_PASSWORD)
    );

    const serverInfo = await driver.getServerInfo();
    console.log(`Connection established, serverInfo: ${serverInfo}`);

    // destructure user A's elementId and user B's elementId from POST body
    const { elementIdA, elementIdB } = req.body;
    // delete all relationships of any type between A and B
    const removedRelationships = await driver.executeQuery(
      'MATCH (a:User WHERE elementId(a)=$elementIdA)-[r]-(b:User WHERE elementId(b)=$elementIdB) DELETE r RETURN r',
      {
        elementIdA,
        elementIdB,
      },
      { database: 'neo4j' }
    );

    await driver.close();

    res.locals.removedRelationships = removedRelationships;
    return next();
  } catch (err) {
    return next({
      log: `removeRelationships connection error\n${err}\nCause: ${err.cause}`,
      status: 500,
      message: {
        err: err.message,
      },
    });
  }
};

// to get user and relationship info, and clean DB

apiController.getAllUsers = async (req, res, next) => {
  try {
    const driver = neo4j.driver(
      process.env.NEO4J_URI,
      neo4j.auth.basic(process.env.NEO4J_USERNAME, process.env.NEO4J_PASSWORD)
    );

    const serverInfo = await driver.getServerInfo();
    console.log(`Connection established, serverInfo: ${serverInfo}`);

    const allUserNodes = await driver.executeQuery('MATCH (n:User) RETURN n', {
      database: 'neo4j',
    });

    await driver.close();
    res.locals.allUserNodes = allUserNodes;
    return next();
  } catch (err) {
    return next({
      log: `getAllUsers connection error\n${err}\nCause: ${err.cause}`,
      status: 500,
      message: {
        err: err.message,
      },
    });
  }
};

apiController.getAllRelationships = async (req, res, next) => {
  try {
    const driver = neo4j.driver(
      process.env.NEO4J_URI,
      neo4j.auth.basic(process.env.NEO4J_USERNAME, process.env.NEO4J_PASSWORD)
    );

    const serverInfo = await driver.getServerInfo();
    console.log(`Connection established, serverInfo: ${serverInfo}`);

    const allUserRelationships = await driver.executeQuery(
      'MATCH ()-[r]-() RETURN r',
      {
        database: 'neo4j',
      }
    );

    await driver.close();

    res.locals.allUserRelationships = allUserRelationships;
    return next();
  } catch (err) {
    return next({
      log: `getAllRelationships connection error\n${err}\nCause: ${err.cause}`,
      status: 500,
      message: {
        err: err.message,
      },
    });
  }
};

// ALTERNATIVE: kill DB Docker container. Restart container with command "docker run -p7474:7474 -p7687:7687 -d -e NEO4J_AUTH=neo4j/secretgraph neo4j:latest".
apiController.deleteDB = async (req, res, next) => {
  try {
    const driver = neo4j.driver(
      process.env.NEO4J_URI,
      neo4j.auth.basic(process.env.NEO4J_USERNAME, process.env.NEO4J_PASSWORD)
    );

    const serverInfo = await driver.getServerInfo();
    console.log(`Connection established, serverInfo: ${serverInfo}`);

    const deletedUserNodes = await driver.executeQuery(
      'MATCH (n:User) DETACH DELETE n RETURN n',
      {
        database: 'neo4j',
      }
    );

    await driver.close();

    res.locals.deletedUserNodes = deletedUserNodes;
    return next();
  } catch (err) {
    return next({
      log: `deleteDB connection error\n${err}\nCause: ${err.cause}`,
      status: 500,
      message: {
        err: err.message,
      },
    });
  }
};

apiController.getAllUserInfo = async (req, res, next) => {
  try {
    const driver = neo4j.driver(
      process.env.NEO4J_URI,
      neo4j.auth.basic(process.env.NEO4J_USERNAME, process.env.NEO4J_PASSWORD)
    );

    const serverInfo = await driver.getServerInfo();
    console.log(`Connection established, serverInfo: ${serverInfo}`);

    const allUserNodes = await driver.executeQuery('MATCH (n:User) RETURN n', {
      database: 'neo4j',
    });

    await driver.close();
    const userInfo = [];
    for (const node of allUserNodes.records) {
      userInfo.push(
        {
          properties: node._fields[0].properties,
          elementId: node._fields[0].elementId,
        },
        '.............NEXT USER..............'
      );
    }
    res.locals.userInfo = userInfo;
    return next();
  } catch (err) {
    return next({
      log: `getAllUsers connection error\n${err}\nCause: ${err.cause}`,
      status: 500,
      message: {
        err,
      },
    });
  }
};

export default apiController;
