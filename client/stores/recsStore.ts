import { create } from 'zustand';
import { createSelectors } from './utils';
import { User, RecsMap } from '../types';

export interface RecsState {
  recs: User[];
  setRecs: (recs: User[]) => void;
  removeOneRec: () => void;
  clearRecs: () => void;
}

const recsStoreBase = create<RecsState>()((set) => ({
  recs: [],
  setRecs: (recs: User[]) => set((_state) => ({ recs: recs })),
  // removeOneRec currently slices the first rec off the array and sets it to the resultant array
  removeOneRec: () => set((state) => ({ recs: state.recs.slice(1) })),
  clearRecs: () => set((_state) => ({ recs: [] })),
}));

const recsStore = createSelectors(recsStoreBase);

export default recsStore;

// try to build user
export interface RecsStateMap {
  recs: RecsMap;
  setRecs: (recs: RecsMap) => void;
  removeOneRec: (updatedRecs: RecsMap) => void;
  clearRecs: () => void;
}

// this implementation will require the transformation of the array of objects into a map before the state is set
const recsStoreBaseMap = create<RecsStateMap>()((set) => ({
  recs: new Map(),
  setRecs: (recs: RecsMap) => set((_state) => ({ recs: recs })),
  // removeOneRec currently slices the first rec off the array and sets it to the resultant array
  removeOneRec: (updatedRecs: RecsMap) =>
    set((state) => ({ recs: updatedRecs })),
  clearRecs: () => set((_state) => ({ recs: new Map() })),
}));

export const recsStoreMap = createSelectors(recsStoreBaseMap);
