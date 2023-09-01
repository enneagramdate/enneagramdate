import { Client } from '@googlemaps/google-maps-services-js';

export const dictionary = new Map();
// Confirmed that, for all types, compatibilities are MUTUAL. For ex.) Type 1 likes 2, and Type 2 likes 1. And so on, for all other types.
dictionary.set(1, new Set([2, 5, 7]));
dictionary.set(2, new Set([1, 8, 9]));
dictionary.set(3, new Set([6, 9]));
dictionary.set(4, new Set([5, 6, 9]));
dictionary.set(5, new Set([1, 4, 8]));
dictionary.set(6, new Set([3, 4, 7, 9]));
dictionary.set(7, new Set([1, 6, 8]));
dictionary.set(8, new Set([2, 5, 7]));
dictionary.set(9, new Set([2, 3, 4, 6]));

// dateString format: '1995-05-10' (YYYY-MM-DD)
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

// Function that geocodes a zip code to a coordinate position
const client = new Client({});
export const addressToPos = async (zip) => {
  const response = await client.geocode({
    params: {
      address: zip,
      key: process.env.GOOGLE_MAPS,
    },
  });
  if (response.data.status === 'OK') {
    return response.data.results[0].geometry.location;
  } else {
    console.log(results.status);
    throw new Error('Problem getting user location');
  }
};
