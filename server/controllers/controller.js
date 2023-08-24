import 'dotenv/config';
import neo4j from 'neo4j-driver';

const createDriver = async () => {
  try {
    const driver = neo4j.driver(
      process.env.NEO4J_URI,
      neo4j.auth.basic(NEO4J_USERNAME, NEO4J_PASSWORD)
    );
    const serverInfo = await driver.getServerInfo();
    console.log(`Connection estabilished, serverInfo: ${serverInfo}`);
    return driver;
  } catch (err) {
    console.log(`Connection error\n${err}\nCause: ${err.cause}`);
    await driver.close();
    return;
  }
};

const apiController = {};

apiController.createNewUser = async (req, res, next) => {
  try {
    const driver = createDriver();
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

    const { records, summary } = await driver.executeQuery(
      'MERGE (u:User {email: $email}) ON CREATE SET u.email=$email, u.password=$password, u.fullName=$fullName, u.enneagramType=$enneagramType, u.birthday=$birthday, u.seekAgeRange=$seekAgeRange, u.gender=$gender, u.seekGender=$seekGender, u.seekRelationship=$seekRelationship, u.location=$location, u.seekRadius=$seekRadius',
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
      { database: 'Instance01' }
    );
    console.log(
      `Created ${summary.counters.updates().nodesCreated} nodes ` +
        `in ${summary.resultAvailableAfter} ms.`
    );
    await driver.close();
  } catch (err) {
    return next(err);
  }
};

export default apiController;
