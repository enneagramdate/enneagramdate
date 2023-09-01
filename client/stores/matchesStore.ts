import { create } from 'zustand';
import { createSelectors } from './utils';
import { MatchChats, Matches, UserId } from '../types';

interface MatchesState {
  matches: Matches;
  currentMatchedUser: UserId;
  setMatches: (matches: Matches) => void;
  chats: MatchChats;
  setMatchChats: (matchChats: MatchChats) => void;
}

const matchesStoreBase = create<MatchesState>()((set) => ({
  matches: new Set(),
  currentMatchedUser: '',
  setMatches: (matches: Matches) => set((_state) => ({ matches: matches })),
  chats: new Map(),
  setMatchChats: (matchChats: MatchChats) =>
    set((_state) => ({ chats: matchChats })),
}));

const matchesStore = createSelectors(matchesStoreBase);

export default matchesStore;
