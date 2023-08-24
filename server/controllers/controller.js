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

    const newUser = await driver.executeQuery(
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
    res.locals.newUserNode = newUser.records[0]._fields[0].properties;
    res.locals.newUserRelationships = [];
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
        let newRelationships = await driver.executeQuery(
          'MATCH (a:User WHERE a.email=$emailA) MATCH (b:User WHERE b.email=$emailB) MERGE (a)-[rToB:RECOMMENDED_FOR]->(b) MERGE (a)<-[rToA:RECOMMENDED_FOR]-(b) RETURN rToB, rToA',
          {
            emailA,
            emailB: userB.email,
          },
          { database: 'neo4j' }
        );
        newRelationships = newRelationships.records.map(
          (record) => record._fields
        );
        // pushes an array of the 2 new RECOMMENDED_FOR relationship objects created between User A and the current User B
        res.locals.newUserRelationships =
          res.locals.newUserRelationships.concat(newRelationships);
      }
    }

    await driver.close();
    return next();
  } catch (err) {
    // await driver.close();
    return next({
      log: `createNewUserRelationships connection error\n${err}\nCause: ${err.cause}`,
      status: 500,
      message: {
        err,
      },
    });
  }
};

// Return currently logged-in User their most compatible partner from other users in DB (recommend 1 partner at a time or all at once in an array, ordered by weighting?)

// Currently logged-in User liked someone (can safely assume partners are recommended for each other)
// if other person LIKES the logged-in User
// remove both unidirectional LIKES relationships
// set (create) bidirectional MATCH relationship
// if other person DISLIKES

// Currently logged-in User disliked someone, remove RECOMMENDED_FOR relationship

export default apiController;
