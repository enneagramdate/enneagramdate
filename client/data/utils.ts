import { EnneagramType } from '../types';

export const mapToJSON = (map: Map<any, any>) => {
  return JSON.stringify(Object.fromEntries(map));
};

export const colorWorkaround =
  'color can be bg-9 bg-8 bg-7 bg-6 bg-5 bg-4 bg-3 bg-2 or bg-1';
