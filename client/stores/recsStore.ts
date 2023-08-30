import { create } from 'zustand';
import { createSelectors } from './utils';
import { RecommendedUser } from '../types';

export interface RecsState {
  recs: RecommendedUser[];
  setRecs: (recs: RecommendedUser[]) => void;
  clearRecs: () => void;
}

const recsStoreBase = create<RecsState>()((set) => ({
  recs: [],
  setRecs: (recs: RecommendedUser[]) => set((_state) => ({ recs: recs })),
  clearRecs: () => set((_state) => ({ recs: [] })),
}));

const recsStore = createSelectors(recsStoreBase);

export default recsStore;

// TODO: delete this old map implementation
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
