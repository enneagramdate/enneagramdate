import { create } from 'zustand';
import { createSelectors } from './utils';
import { ChatLog, MatchChats, Matches } from '../types';

interface MatchesState {
  matches: Matches;
  setMatches: (matches: Matches) => void;
  chat: ChatLog;
  setChat: (updatedChatLog: ChatLog) => void;
}

const singleMatchesStoreBase = create<MatchesState>()((set) => ({
  matches: new Set(),
  setMatches: (matches: Matches) => set((_state) => ({ matches: matches })),
  chat: [],
  setChat: (updatedChatLog: ChatLog) =>
    set((_state) => ({ chat: updatedChatLog })),
}));

const singleMatchesStore = createSelectors(singleMatchesStoreBase);

export default singleMatchesStore;
