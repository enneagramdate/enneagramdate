import { create } from 'zustand';
import { createSelectors } from './utils';
import { Matches } from '../types';

interface MatchesState {
  matches: Matches;
  setMatches: (matches: Matches) => void;
}

const matchesStoreBase = create<MatchesState>()((set) => ({
  matches: new Set(),
  setMatches: (matches: Matches) => set((_state) => ({ matches: matches })),
}));

const matchesStore = createSelectors(matchesStoreBase);

export default matchesStore;
