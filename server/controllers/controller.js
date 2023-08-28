import 'dotenv/config';
import neo4j from 'neo4j-driver';
import { dictionary, getAge } from '../../utils.js';
import { point } from '@turf/helpers';
import distance from '@turf/distance';

const apiController = {};

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
    console.log(`Connection estabilished, serverInfo: ${serverInfo}`);

    // use the driver to run queries
    const {
      email,
      password,
      fullName,
      enneagramType,
      birthday,
      seekAgeRange,
      gender,
      seekGender,
      seekRelationship,
      location,
      seekRadius,
    } = req.body;

    const newUserNode = await driver.executeQuery(
      'MERGE (u:User {email: $email}) ON CREATE SET u.password=$password, u.fullName=$fullName, u.enneagramType=$enneagramType, u.birthday=$birthday, u.seekAgeRange=$seekAgeRange, u.gender=$gender, u.seekGender=$seekGender, u.seekRelationship=$seekRelationship, u.location=$location, u.seekRadius=$seekRadius RETURN u',
      {
        email,
        password,
        fullName,
        enneagramType,
        birthday,
        seekAgeRange,
        gender,
        seekGender,
        seekRelationship,
        location,
        seekRadius,
      },
      { database: 'neo4j' }
    );

    // close driver to free allocated resources
    await driver.close();

    res.locals.newUserNode = newUserNode;
    return next();
  } catch (err) {
    return next({
      log: `createNewUserNode connection error\n${err}\nCause: ${err.cause}`,
      status: 500,
      message: {
        err,
      },
    });
  }
};

// Add controller for User A to be able to edit their profile information (replace images, change preferences, etc.)

// For the new User node, create RECOMMENDED_FOR relationships with all other compatible partners in DB

apiController.createNewUserRecommendations = async (req, res, next) => {
  try {
    const driver = neo4j.driver(
      process.env.NEO4J_URI,
      neo4j.auth.basic(process.env.NEO4J_USERNAME, process.env.NEO4J_PASSWORD)
    );

    const serverInfo = await driver.getServerInfo();
    console.log(`Connection estabilished, serverInfo: ${serverInfo}`);

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
      location,
      seekRadius,
    } = res.locals.newUserNode.records[0]._fields[0].properties;

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
    const userALocation = point(location);

    // iterate over all User nodes that are NOT User A
    for (const userB of allOtherUsers) {
      // get User B's age
      const userBAge = getAge(userB.birthday);
      // get User B's location, then calculate distance between A and B
      const userBLocation = point(userB.location);
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
        err,
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
    console.log(`Connection estabilished, serverInfo: ${serverInfo}`);

    let userElId;
    // Signup case: get new user's elementId from res.locals
    // Login case: destructure user's elementId from POST body (safer to store elementId on FE than user's email)
    // Refer to Express doc: https://expressjs.com/en/guide/routing.html. Route parameters must be made up of “word characters” ([A-Za-z0-9_]), so passing elementIds or emails as params won't work.
    if (res.locals.newUserNode) {
      userElId = res.locals.newUserNode.records[0]._fields[0].elementId;
    } else {
      const { userId } = req.body;
      userElId = userId;
    }

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
        err,
      },
    });
  }
};

// User A LIKES User B

apiController.createLikesOrMatch = async (req, res, next) => {
  try {
    const driver = neo4j.driver(
      process.env.NEO4J_URI,
      neo4j.auth.basic(process.env.NEO4J_USERNAME, process.env.NEO4J_PASSWORD)
    );

    const serverInfo = await driver.getServerInfo();
    console.log(`Connection estabilished, serverInfo: ${serverInfo}`);

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
        'MATCH (a:User WHERE elementId(a)=$elementIdA)-[r:RECOMMENDED_FOR]->(b:User WHERE elementId(b)=$elementIdB) DELETE r MERGE (a)-[l:LIKES]->(b) RETURN l',
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
        err,
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
    console.log(`Connection estabilished, serverInfo: ${serverInfo}`);

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
        err,
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
    console.log(`Connection estabilished, serverInfo: ${serverInfo}`);

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
        err,
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
    console.log(`Connection estabilished, serverInfo: ${serverInfo}`);

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
        err,
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
    console.log(`Connection estabilished, serverInfo: ${serverInfo}`);

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
        err,
      },
    });
  }
};

export default apiController;
