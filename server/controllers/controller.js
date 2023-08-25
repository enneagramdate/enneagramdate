import 'dotenv/config';
import neo4j from 'neo4j-driver';
import dictionary from '../../enneagramCompatibilitiesDictionary.js';

const apiController = {};

// Create a new User node

apiController.createNewUserNode = async (req, res, next) => {
  try {
    const driver = neo4j.driver(
      process.env.NEO4J_URI,
      neo4j.auth.basic(process.env.NEO4J_USERNAME, process.env.NEO4J_PASSWORD)
    );
    const serverInfo = await driver.getServerInfo();
    console.log(`Connection estabilished, serverInfo: ${serverInfo}`);

    // Use the driver to run queries
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
    await driver.close();
    res.locals.newUserNode = newUserNode.records[0]._fields[0].properties;
    return next();
  } catch (err) {
    // await driver.close();
    return next({
      log: `createNewUserNode connection error\n${err}\nCause: ${err.cause}`,
      status: 500,
      message: {
        err,
      },
    });
  }
};

// For a new User node, create RECOMMENDED_FOR relationships with all other enneagram-compatible partners in DB
// Return currently logged-in User their most compatible partner from other users in DB (recommend 1 partner at a time or all at once in an array, ordered by weighting?)

apiController.createNewUserRecommendations = async (req, res, next) => {
  try {
    const driver = neo4j.driver(
      process.env.NEO4J_URI,
      neo4j.auth.basic(process.env.NEO4J_USERNAME, process.env.NEO4J_PASSWORD)
    );
    const serverInfo = await driver.getServerInfo();
    console.log(`Connection estabilished, serverInfo: ${serverInfo}`);

    // Use the driver to run queries
    const emailA = res.locals.newUserNode.email;

    // Store all existing Users that are NOT the newly created User
    let allOtherUsers = await driver.executeQuery(
      'MATCH (u:User WHERE u.email <> $emailA) RETURN u',
      {
        emailA,
      },
      { database: 'neo4j' }
    );

    // Parse output array of User records for just the properties objects on those record objects
    allOtherUsers = allOtherUsers.records.map(
      (record) => record._fields[0].properties
    );

    // From here:
    // User A = newly created User node
    // User B = another User node in DB

    // Get A's enneagram type and Set of compatible types
    const enneagramType = res.locals.newUserNode.enneagramType;
    const compatabilityResults = dictionary.get(enneagramType);

    // Iterate over all User nodes that are NOT User A
    for (const userB of allOtherUsers) {
      // if User's A compatible types Set contains User B's enneagram type, create RECOMMENDED_FOR relationships both ways
      if (compatabilityResults.has(userB.enneagramType)) {
        let newUserRecommendations = await driver.executeQuery(
          'MATCH (a:User WHERE a.email=$emailA) MATCH (b:User WHERE b.email=$emailB) MERGE (a)-[rToB:RECOMMENDED_FOR]->(b) MERGE (a)<-[rToA:RECOMMENDED_FOR]-(b) RETURN rToB, rToA',
          {
            emailA,
            emailB: userB.email,
          },
          { database: 'neo4j' }
        );
        newUserRecommendations = newUserRecommendations.records.map(
          (record) => record._fields
        );
        // pushes an array of the 2 new RECOMMENDED_FOR relationship objects created between User A and the current User B
        res.locals.newUserRecommendations = [];
        res.locals.newUserRecommendations =
          res.locals.newUserRecommendations.concat(newUserRecommendations);
      }
    }

    await driver.close();
    return next();
  } catch (err) {
    // await driver.close();
    return next({
      log: `createNewUserRecommendations connection error\n${err}\nCause: ${err.cause}`,
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

    // Use the driver to run queries
    // Refer to Express doc: https://expressjs.com/en/guide/routing.html. Route parameters must be made up of “word characters” ([A-Za-z0-9_]), so passing elementIds or emails as params won't work.
    // res.locals.newUserRecommendations is an array of arrays of 2 objs: [[{}, {}]]. First obj is relationship from A to B. Second obj is relationship from B to A. Frontend needs to provide elementId of second obj, and the start and end node elementIds from the first obj.
    const { elementIdBToA, startNodeElementId, endNodeElementId } = req.body;

    // check status of B towards A
    const BtoARelationship = await driver.executeQuery(
      'MATCH ()-[r WHERE elementId(r)=$elementIdBToA]-() RETURN r',
      {
        elementIdBToA,
      },
      { database: 'neo4j' }
    );

    // if B LIKES A
    if (BtoARelationship.records[0]._fields[0].type === 'LIKES') {
      // delete B to A LIKES relationship
      // delete A to B RECOMMENDED_FOR relationship
      // create MATCH relationships going both ways
      const ABmatches = await driver.executeQuery(
        'MATCH (a:User WHERE elementId(a)=$startNodeElementId)-[r]-(b:User WHERE elementId(b)=$endNodeElementId) DELETE r MERGE (a)-[r:MATCH]->(b) MERGE (a)<-[r:MATCH]-(b)',
        {
          startNodeElementId,
          endNodeElementId,
        },
        { database: 'neo4j' }
      );
    }
    // if B is RECOMMENDED_FOR A
    else if (
      BtoARelationship.records[0]._fields[0].type === 'RECOMMENDED_FOR'
    ) {
      // delete A to B RECOMMENDED_FOR relationship
      // create A to B LIKES relationship
      const AtoBUpdate = await driver.executeQuery(
        'MATCH (a:User WHERE elementId(a)=$startNodeElementId)-[r]-(b:User WHERE elementId(b)=$endNodeElementId) DELETE r MERGE (a)-[r:LIKES]->(b)',
        {
          startNodeElementId,
          endNodeElementId,
        },
        { database: 'neo4j' }
      );
    }

    await driver.close();
    res.locals.BtoARelationship = BtoARelationship;
    return next();
  } catch (err) {
    // await driver.close();
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

    // Use the driver to run queries
    // res.locals.newUserRecommendations is an array of arrays of 2 objs: [[{}, {}]]. First obj is relationship from A to B. Second obj is relationship from B to A. Frontend needs to provide the start and end node elementIds from the first obj.
    const { startNodeElementId, endNodeElementId } = req.body;

    // delete all relationships (RECOMMENDED_FOR or LIKES) between A and B
    const removedRelationships = await driver.executeQuery(
      'MATCH (a:User WHERE elementId(a)=$startNodeElementId)-[r]-(b:User WHERE elementId(b)=$endNodeElementId) DELETE r RETURN r',
      {
        startNodeElementId,
        endNodeElementId,
      },
      { database: 'neo4j' }
    );

    await driver.close();
    res.locals.removedRelationships = removedRelationships;
    return next();
  } catch (err) {
    // await driver.close();
    return next({
      log: `removeRelationships connection error\n${err}\nCause: ${err.cause}`,
      status: 500,
      message: {
        err,
      },
    });
  }
};

export default apiController;
