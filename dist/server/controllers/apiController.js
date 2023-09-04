var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import 'dotenv/config';
import { S3Client, PutObjectCommand, GetObjectCommand, } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from 'uuid';
import neo4j from 'neo4j-driver';
import { hash, compare } from 'bcrypt';
import jwt from 'jsonwebtoken';
import { addressToPos, dictionary, getAge } from '../utils.js';
import { point } from '@turf/helpers';
import distance from '@turf/distance';
const apiController = {};
const { BUCKET_NAME, BUCKET_REGION, ACCESS_KEY, SECRET_ACCESS_KEY, SALT_ROUNDS, JWT_SECRET, NEO4J_URI, NEO4J_USERNAME, NEO4J_PASSWORD, } = process.env;
apiController.storeUploadedMedia = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const s3ClientOptions = {
            credentials: {
                accessKeyId: ACCESS_KEY,
                secretAccessKey: SECRET_ACCESS_KEY,
            },
            region: BUCKET_REGION,
        };
        const s3 = new S3Client(s3ClientOptions);
        const { mimetype, buffer } = req.file;
        const uploadKey = uuidv4();
        const putOptions = {
            Bucket: BUCKET_NAME,
            Key: uploadKey,
            ContentType: mimetype,
            Body: buffer,
        };
        yield s3.send(new PutObjectCommand(putOptions));
        const getOptions = {
            Bucket: BUCKET_NAME,
            Key: uploadKey,
        };
        const s3UploadUrl = yield getSignedUrl(s3, new GetObjectCommand(getOptions), { expiresIn: 604800 });
        res.locals.s3UploadUrl = s3UploadUrl;
        return next();
    }
    catch (err) {
        return next({
            log: `storeUploadedMedia connection error\n${err}\nCause: ${err.cause}`,
            status: 500,
            message: {
                err: 'Error uploading photo',
            },
        });
    }
});
apiController.createNewUserNode = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const driver = neo4j.driver(NEO4J_URI, neo4j.auth.basic(NEO4J_USERNAME, NEO4J_PASSWORD));
        const serverInfo = yield driver.getServerInfo();
        console.log(`Connection established, serverInfo: ${serverInfo}`);
        const { email, password, fullName, enneagramType, birthday, gender, seekGender, seekRelationship, location, seekRadius, } = req.body;
        const seekAgeRange = req.body.seekAgeRange
            .split(',')
            .map((str) => Number(str));
        const s3UploadUrl = res.locals.s3UploadUrl;
        const existingUser = yield driver.executeQuery('MATCH (u:User WHERE u.email=$email) RETURN u', {
            email,
        }, { database: 'neo4j' });
        if (existingUser.records[0]) {
            throw new Error('A new user was not created because a user with this email already exists.');
        }
        const hashedPassword = yield hash(password, Number(SALT_ROUNDS));
        const { lat, lng } = yield addressToPos(location);
        const newUserNode = yield driver.executeQuery('MERGE (u:User {email: $email}) ON CREATE SET u.password=$hashedPassword, u.fullName=$fullName, u.enneagramType=$enneagramType, u.birthday=$birthday, u.seekAgeRange=$seekAgeRange, u.gender=$gender, u.seekGender=$seekGender, u.seekRelationship=$seekRelationship, u.lat=$lat, u.lng=$lng, u.seekRadius=$seekRadius, u.s3UploadUrl=$s3UploadUrl RETURN u', {
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
        }, { database: 'neo4j' });
        yield driver.close();
        res.locals.user = newUserNode;
        res.locals.token = jwt.sign(newUserNode.records[0]._fields[0].elementId, JWT_SECRET);
        return next();
    }
    catch (err) {
        return next({
            log: `createNewUserNode connection error\n${err}\nCause: ${err.cause}`,
            status: 500,
            message: {
                err: err.message,
            },
        });
    }
});
apiController.createNewUserRecommendations = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const driver = neo4j.driver(NEO4J_URI, neo4j.auth.basic(NEO4J_USERNAME, NEO4J_PASSWORD));
        const serverInfo = yield driver.getServerInfo();
        console.log(`Connection established, serverInfo: ${serverInfo}`);
        const { email, enneagramType, birthday, seekAgeRange, gender, seekGender, seekRelationship, lat, lng, seekRadius, } = res.locals.user.records[0]._fields[0].properties;
        const allOtherUsers = yield driver.executeQuery('MATCH (u:User WHERE u.email <> $email) RETURN u', {
            email,
        }, { database: 'neo4j' });
        const adjustedAllOtherUsers = allOtherUsers.records.map((record) => record._fields[0].properties);
        const compatibleTypesForA = dictionary.get(enneagramType);
        const userAAge = getAge(birthday);
        const userALocation = point([lng, lat]);
        console.log(userALocation);
        for (const userB of adjustedAllOtherUsers) {
            const userBAge = getAge(userB.birthday);
            const userBLocation = point([userB.lng, userB.lat]);
            const distanceAToB = distance(userALocation, userBLocation, {
                units: 'miles',
            });
            if (compatibleTypesForA !== undefined &&
                compatibleTypesForA.has(userB.enneagramType) &&
                seekAgeRange[0] <= userBAge &&
                userBAge <= seekAgeRange[1] &&
                seekGender === userB.gender &&
                seekRelationship === userB.seekRelationship &&
                distanceAToB <= Number(seekRadius) &&
                userB.seekAgeRange[0] <= userAAge &&
                userAAge <= userB.seekAgeRange[1] &&
                userB.seekGender === gender &&
                distanceAToB <= Number(userB.seekRadius)) {
                const newUserRecommendations = yield driver.executeQuery('MATCH (a:User WHERE a.email=$email) MATCH (b:User WHERE b.email=$emailB) MERGE (a)-[rAtoB:RECOMMENDED_FOR]->(b) MERGE (a)<-[rBtoA:RECOMMENDED_FOR]-(b)', {
                    email,
                    emailB: userB.email,
                }, { database: 'neo4j' });
            }
        }
        yield driver.close();
        return next();
    }
    catch (err) {
        return next({
            log: `createNewUserRecommendations connection error\n${err}\nCause: ${err.cause}`,
            status: 500,
            message: {
                err: err.message,
            },
        });
    }
});
apiController.verifyUserExists = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const driver = neo4j.driver(NEO4J_URI, neo4j.auth.basic(NEO4J_USERNAME, NEO4J_PASSWORD));
        const serverInfo = yield driver.getServerInfo();
        console.log(`Connection established, serverInfo: ${serverInfo}`);
        const { email, password } = req.body;
        const existingUser = yield driver.executeQuery('MATCH (u:User WHERE u.email=$email) RETURN u', {
            email,
        }, { database: 'neo4j' });
        yield driver.close();
        if (existingUser.records[0] &&
            (yield compare(password, existingUser.records[0]._fields[0].properties.password))) {
            res.locals.user = existingUser;
            res.locals.token = jwt.sign(existingUser.records[0]._fields[0].elementId, JWT_SECRET);
            return next();
        }
        else {
            throw new Error('Invalid email or password.');
        }
    }
    catch (err) {
        return next({
            log: `verifyUserExists connection error\n${err}\nCause: ${err.cause}`,
            status: 500,
            message: {
                err: err.message,
            },
        });
    }
});
apiController.sendLatestRelationships = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const driver = neo4j.driver(NEO4J_URI, neo4j.auth.basic(NEO4J_USERNAME, NEO4J_PASSWORD));
        const serverInfo = yield driver.getServerInfo();
        console.log(`Connection established, serverInfo: ${serverInfo}`);
        const userElId = res.locals.user.records[0]._fields[0].elementId;
        const latestRelationships = yield driver.executeQuery('MATCH (a:User WHERE elementId(a)=$userElId)<-[r]-(b:User) RETURN b, r', {
            userElId,
        }, { database: 'neo4j' });
        yield driver.close();
        res.locals.latestRelationships = latestRelationships;
        return next();
    }
    catch (err) {
        return next({
            log: `sendLatestRelationships connection error\n${err}\nCause: ${err.cause}`,
            status: 500,
            message: {
                err: err.message,
            },
        });
    }
});
apiController.postNewChats = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const driver = neo4j.driver(NEO4J_URI, neo4j.auth.basic(NEO4J_USERNAME, NEO4J_PASSWORD));
        const serverInfo = yield driver.getServerInfo();
        console.log(`Connection established, serverInfo: ${serverInfo}`);
        const { elementIdA, elementIdB, allChats } = req.body;
        const matchesChatHistory = yield driver.executeQuery('MATCH (a:User WHERE elementId(a)=$elementIdA)-[r:MATCH]-(b:User WHERE elementId(b)=$elementIdB) SET r.allChats=$allChats RETURN r', {
            elementIdA,
            elementIdB,
            allChats,
        }, { database: 'neo4j' });
        yield driver.close();
        res.locals.matchesChatHistory = matchesChatHistory;
        return next();
    }
    catch (err) {
        return next({
            log: `postNewChats connection error\n${err}\nCause: ${err.cause}`,
            status: 500,
            message: {
                err: err.message,
            },
        });
    }
});
apiController.createLikesOrMatch = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const driver = neo4j.driver(NEO4J_URI, neo4j.auth.basic(NEO4J_USERNAME, NEO4J_PASSWORD));
        const serverInfo = yield driver.getServerInfo();
        console.log(`Connection established, serverInfo: ${serverInfo}`);
        const { elementIdA, elementIdB } = req.body;
        const BtoARelationship = yield driver.executeQuery('MATCH (a:User WHERE elementId(a)=$elementIdA)<-[r]-(b:User WHERE elementId(b)=$elementIdB) RETURN type(r)', {
            elementIdA,
            elementIdB,
        }, { database: 'neo4j' });
        if (BtoARelationship.records[0]._fields[0] === 'LIKES') {
            const AmatchesB = yield driver.executeQuery('MATCH (a:User WHERE elementId(a)=$elementIdA)-[r]-(b:User WHERE elementId(b)=$elementIdB) DELETE r MERGE (a)-[m:MATCH]->(b) MERGE (a)<-[n:MATCH]-(b) RETURN m, n', {
                elementIdA,
                elementIdB,
            }, { database: 'neo4j' });
            res.locals.AmatchesB = AmatchesB;
        }
        else if (BtoARelationship.records[0]._fields[0] === 'RECOMMENDED_FOR') {
            const AlikesB = yield driver.executeQuery('MATCH (a:User WHERE elementId(a)=$elementIdA)-[r:RECOMMENDED_FOR]->(b:User WHERE elementId(b)=$elementIdB) MERGE (a)-[l:LIKES]->(b) RETURN l', {
                elementIdA,
                elementIdB,
            }, { database: 'neo4j' });
            const RemoveRecommendationBtoA = yield driver.executeQuery('MATCH (b:User WHERE elementId(b)=$elementIdB)-[r:RECOMMENDED_FOR]->(a:User WHERE elementId(a)=$elementIdA) DELETE r', {
                elementIdB,
                elementIdA,
            }, { database: 'neo4j' });
            res.locals.AlikesB = AlikesB;
        }
        yield driver.close();
        return next();
    }
    catch (err) {
        return next({
            log: `createLikesOrMatch connection error\n${err}\nCause: ${err.cause}`,
            status: 500,
            message: {
                err: err.message,
            },
        });
    }
});
apiController.removeRelationships = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const driver = neo4j.driver(NEO4J_URI, neo4j.auth.basic(NEO4J_USERNAME, NEO4J_PASSWORD));
        const serverInfo = yield driver.getServerInfo();
        console.log(`Connection established, serverInfo: ${serverInfo}`);
        const { elementIdA, elementIdB } = req.body;
        const removedRelationships = yield driver.executeQuery('MATCH (a:User WHERE elementId(a)=$elementIdA)-[r]-(b:User WHERE elementId(b)=$elementIdB) DELETE r RETURN r', {
            elementIdA,
            elementIdB,
        }, { database: 'neo4j' });
        yield driver.close();
        res.locals.removedRelationships = removedRelationships;
        return next();
    }
    catch (err) {
        return next({
            log: `removeRelationships connection error\n${err}\nCause: ${err.cause}`,
            status: 500,
            message: {
                err: err.message,
            },
        });
    }
});
apiController.getAllUsers = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const driver = neo4j.driver(NEO4J_URI, neo4j.auth.basic(NEO4J_USERNAME, NEO4J_PASSWORD));
        const serverInfo = yield driver.getServerInfo();
        console.log(`Connection established, serverInfo: ${serverInfo}`);
        const allUserNodes = yield driver.executeQuery('MATCH (n:User) RETURN n', {
            database: 'neo4j',
        });
        yield driver.close();
        res.locals.allUserNodes = allUserNodes;
        return next();
    }
    catch (err) {
        return next({
            log: `getAllUsers connection error\n${err}\nCause: ${err.cause}`,
            status: 500,
            message: {
                err: err.message,
            },
        });
    }
});
apiController.getAllRelationships = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const driver = neo4j.driver(NEO4J_URI, neo4j.auth.basic(NEO4J_USERNAME, NEO4J_PASSWORD));
        const serverInfo = yield driver.getServerInfo();
        console.log(`Connection established, serverInfo: ${serverInfo}`);
        const allUserRelationships = yield driver.executeQuery('MATCH ()-[r]-() RETURN r', {
            database: 'neo4j',
        });
        yield driver.close();
        res.locals.allUserRelationships = allUserRelationships;
        return next();
    }
    catch (err) {
        return next({
            log: `getAllRelationships connection error\n${err}\nCause: ${err.cause}`,
            status: 500,
            message: {
                err: err.message,
            },
        });
    }
});
apiController.deleteDB = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const driver = neo4j.driver(NEO4J_URI, neo4j.auth.basic(NEO4J_USERNAME, NEO4J_PASSWORD));
        const serverInfo = yield driver.getServerInfo();
        console.log(`Connection established, serverInfo: ${serverInfo}`);
        const deletedUserNodes = yield driver.executeQuery('MATCH (n:User) DETACH DELETE n RETURN n', {
            database: 'neo4j',
        });
        yield driver.close();
        res.locals.deletedUserNodes = deletedUserNodes;
        return next();
    }
    catch (err) {
        return next({
            log: `deleteDB connection error\n${err}\nCause: ${err.cause}`,
            status: 500,
            message: {
                err: err.message,
            },
        });
    }
});
apiController.getAllUserInfo = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const driver = neo4j.driver(NEO4J_URI, neo4j.auth.basic(NEO4J_USERNAME, NEO4J_PASSWORD));
        const serverInfo = yield driver.getServerInfo();
        console.log(`Connection established, serverInfo: ${serverInfo}`);
        const allUserNodes = yield driver.executeQuery('MATCH (n:User) RETURN n', {
            database: 'neo4j',
        });
        yield driver.close();
        const userInfo = [];
        for (const node of allUserNodes.records) {
            userInfo.push({
                properties: node._fields[0].properties,
                elementId: node._fields[0].elementId,
            }, '.............NEXT USER..............');
        }
        res.locals.userInfo = userInfo;
        return next();
    }
    catch (err) {
        return next({
            log: `getAllUsers connection error\n${err}\nCause: ${err.cause}`,
            status: 500,
            message: {
                err,
            },
        });
    }
});
export default apiController;
//# sourceMappingURL=apiController.js.map