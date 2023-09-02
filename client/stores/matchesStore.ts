import { create } from 'zustand';
import { createSelectors } from './utils';
import { MatchChats, Matches, RecommendedUser, UserId } from '../types';

interface MatchesState {
  matches: RecommendedUser[];
  currentMatchedUser: UserId;
  setMatchedUser: (matchedUserId: UserId) => void;
  setMatches: (matches: Matches) => void;
  chats: MatchChats;
  setMatchChats: (matchChats: MatchChats) => void;
}

const matchesStoreBase = create<MatchesState>()((set) => ({
  matches: [],
  currentMatchedUser: '',
  setMatchedUser: (matchedUserId: UserId) =>
    set((_state) => ({ currentMatchedUser: matchedUserId })),
  setMatches: (matches: Matches) => set((_state) => ({ matches: matches })),
  chats: new Map(),
  setMatchChats: (matchChats: MatchChats) =>
    set((_state) => ({ chats: matchChats })),
}));

const matchesStore = createSelectors(matchesStoreBase);

export default matchesStore;
