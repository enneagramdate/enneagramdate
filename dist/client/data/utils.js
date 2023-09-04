export const mapToJSON = (map) => {
    return JSON.stringify(Object.fromEntries(map));
};
export const colorWorkaround = 'bg-9 bg-8 bg-7 bg-6 bg-5 bg-4 bg-3 bg-2 bg-1';
export const setTypeTextColor = (type) => {
    switch (type) {
        case '7':
            return 'text-black';
        case '6':
            return 'text-black';
        case '5':
            return 'text-black';
        default:
            return 'text-white';
    }
};
export function getAge(dateString) {
    var today = new Date();
    var birthDate = new Date(dateString);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}
export const getUserData = (parseRes) => {
    const data = {};
    const { properties, elementId } = parseRes.user.records[0]._fields[0];
    data.properties = properties;
    data.elementId = elementId;
    const userRecs = [];
    const userMatches = [];
    const userMatchChats = new Map();
    for (const record of parseRes.latestRelationships.records) {
        const field = record._fields;
        const personAllProperties = field[0].properties;
        console.log(personAllProperties);
        const { enneagramType, fullName, s3UploadUrl, birthday } = personAllProperties;
        const relationship = field[1];
        const { startNodeElementId, type } = relationship;
        const person = {
            enneagramType: enneagramType,
            imgUrl: [s3UploadUrl],
            age: getAge(birthday),
            name: fullName,
            elementId: startNodeElementId,
        };
        if (type === 'RECOMMENDED_FOR') {
            userRecs.push(person);
        }
        if (type === 'MATCH') {
            userMatches.push(person);
        }
    }
    data.userRecs = userRecs;
    data.userMatches = userMatches;
    data.userMatchChats = userMatchChats;
    return data;
};
//# sourceMappingURL=utils.js.map