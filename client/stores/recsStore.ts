import { create } from 'zustand';
import { createSelectors } from './utils';
import { RecsMap } from '../types';

export interface RecsState {
  recs: RecsMap;
  setRecs: (recs: RecsMap) => void;
  removeOneRec: (updatedRecs: RecsMap) => void;
  clearRecs: () => void;
}

const recsStoreBase = create<RecsState>()((set) => ({
  recs: new Map(),
  setRecs: (recs: RecsMap) => set((_state) => ({ recs: recs })),
  removeOneRec: (updatedRecs: RecsMap) =>
    set((_state) => ({ recs: updatedRecs })),
  clearRecs: () => set((_state) => ({ recs: new Map() })),
}));

const recsStore = createSelectors(recsStoreBase);

export default recsStore;

// * OLD ARRAY IMPLEMENTATION - if I need to change bac, will need to update types in components, but this is a quick fix
// * the entire reason I switched to a map implementation was to increase efficiency of the removeOneRec function in the recsStore
// * the idea being that this is the function that will run most frequently as the user swipes on profiles,
// * so it makes sense to build around optimizing that function for best UX
//import { create } from 'zustand';
// import { createSelectors } from './utils';
// import { User, RecsMap } from '../types';

// export interface RecsState {
//   recs: User[];
//   setRecs: (recs: User[]) => void;
//   removeOneRec: () => void;
//   clearRecs: () => void;
// }

// const recsStoreBase = create<RecsState>()((set) => ({
//   recs: [],
//   setRecs: (recs: User[]) => set((_state) => ({ recs: recs })),
//   removeOneRec currently slices the first rec off the array and sets it to the resultant array
//   removeOneRec: () => set((state) => ({ recs: state.recs.slice(1) })),
//   clearRecs: () => set((_state) => ({ recs: [] })),
// }));

// const recsStore = createSelectors(recsStoreBase);

// export default recsStore;
