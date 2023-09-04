import { create } from 'zustand';
import { createSelectors } from './utils';
const recsStoreBase = create()((set) => ({
    recs: [],
    setRecs: (recs) => set((_state) => ({ recs: recs })),
    clearRecs: () => set((_state) => ({ recs: [] })),
}));
const recsStore = createSelectors(recsStoreBase);
export default recsStore;
