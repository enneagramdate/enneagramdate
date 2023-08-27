// import { create } from 'zustand';
// import { createSelectors } from './utils';
// import { RecsMap } from '../types';

// export interface RecsState {
//   recs: RecsMap;
//   setRecs: (recs: RecsMap) => void;
//   removeOneRec: (updatedRecs: RecsMap) => void;
//   clearRecs: () => void;
// }

// const recsStoreBase = create<RecsState>()((set) => ({
//   recs: new Map(),
//   setRecs: (recs: RecsMap) => set((_state) => ({ recs: recs })),
//   removeOneRec: (updatedRecs: RecsMap) =>
//     set((_state) => ({ recs: updatedRecs })),
//   clearRecs: () => set((_state) => ({ recs: new Map() })),
// }));

// const recsStore = createSelectors(recsStoreBase);

// export default recsStore;

// * OLD ARRAY IMPLEMENTATION - if I need to change bac, will need to update types in components, but this is a quick fix
// * the entire reason I switched to a map implementation was to increase efficiency of the removeOneRec function in the recsStore
// * the idea being that this is the function that will run most frequently as the user swipes on profiles,
// * so it makes sense to build around optimizing that function for best UX
// * however I realized that I can just clone the array, pop off the last element, and then pass that updatedRecs array into the removeOneRec func
// * theoretically I think this is the same time complexity as the map implementation? But I'll leave the Map implementation for now; it's an easy refactor if needed
import { create } from 'zustand';
import { createSelectors } from './utils';
import { User } from '../types';

export interface RecsState {
  recs: User[];
  setRecs: (recs: User[]) => void;
  clearRecs: () => void;
}

const recsStoreBase = create<RecsState>()((set) => ({
  recs: [],
  setRecs: (recs: User[]) => set((_state) => ({ recs: recs })),
  clearRecs: () => set((_state) => ({ recs: [] })),
}));

const recsStore = createSelectors(recsStoreBase);

export default recsStore;
