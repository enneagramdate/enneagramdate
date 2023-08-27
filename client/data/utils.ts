import { EnneagramType } from '../types';

export const mapToJSON = (map: Map<any, any>) => {
  return JSON.stringify(Object.fromEntries(map));
};

// ! Given the way tailwind compiles dynamic classes, the dynamic color classes won't load properly the
// ! post-resolution class name exists somewhere in the codebase, so it is being put here as a global reference
// ! see: https://www.codeconcisely.com/posts/tailwind-css-dynamic-class/
export const colorWorkaround = 'bg-9 bg-8 bg-7 bg-6 bg-5 bg-4 bg-3 bg-2 bg-1';
