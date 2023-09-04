import {
  EnneagramType,
  FilteredResponseData,
  MatchChats,
  RecommendedUser,
} from '../types';

export const mapToJSON = (map: Map<any, any>) => {
  return JSON.stringify(Object.fromEntries(map));
};

// ! Given the way tailwind compiles dynamic classes, the dynamic color classes won't load properly unless the
// ! post-evaluation class name exists somewhere in the codebase, so it is being put here as a global reference
// ! see: https://www.codeconcisely.com/posts/tailwind-css-dynamic-class/
export const colorWorkaround = 'bg-9 bg-8 bg-7 bg-6 bg-5 bg-4 bg-3 bg-2 bg-1';

export const setTypeTextColor = (type: EnneagramType) => {
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

export function getAge(dateString: string) {
  var today = new Date();
  var birthDate = new Date(dateString);
  var age = today.getFullYear() - birthDate.getFullYear();
  var m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

export const getUserData = (parseRes: any) => {
  const data: FilteredResponseData | any = {};
  const { properties, elementId } = parseRes.user.records[0]._fields[0];
  data.properties = properties;
  data.elementId = elementId;
  const userRecs: RecommendedUser[] = [];
  const userMatches: RecommendedUser[] = [];
  const userMatchChats: MatchChats = new Map();
  for (const record of parseRes.latestRelationships.records) {
    const field = record._fields;
    const personAllProperties = field[0].properties;
    console.log(personAllProperties);
    const { enneagramType, fullName, s3UploadUrl, birthday } =
      personAllProperties;
    const relationship = field[1];
    const { startNodeElementId, type } = relationship;
    // add the recommended user to userRecs temporary array
    const person: RecommendedUser = {
      enneagramType: enneagramType,
      imgUrl: [s3UploadUrl],
      age: getAge(birthday),
      name: fullName,
      elementId: startNodeElementId,
    };
    if (type === 'RECOMMENDED_FOR') {
      userRecs.push(person);
    }
    // add the matched user to userMatches temporary array
    if (type === 'MATCH') {
      userMatches.push(person);
      // TODO: if there is a chat history, add that as well
    }
  }
  data.userRecs = userRecs;
  data.userMatches = userMatches;
  data.userMatchChats = userMatchChats;
  return data;
};

// RETURN { properties, elementId, userRecs, userMatches, userMatchChats }

//   user.setUserState(properties, elementId);
//       setRecs(userRecs);
//      setMatches(userMatches);
//      setMatchChats(userMatchChats);
