import { create } from 'zustand';
import { createSelectors } from './utils';
import { User } from '../types';

export interface RecsState {
  recs: User[];
  setRecs: (recs: User[]) => void;
  // removeOneRec: () => void;
  clearRecs: () => void;
}

const recsStoreBase = create<RecsState>()((set) => ({
  recs: [],
  setRecs: (recs: User[]) => set((_state) => ({ recs: recs })),
  // removeOneRec: () => set((state) => ({ recs: state.recs}))
  clearRecs: () => set((_state) => ({ recs: [] })),
}));

const recsStore = createSelectors(recsStoreBase);

export default recsStore;
