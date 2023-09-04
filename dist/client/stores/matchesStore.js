import { create } from 'zustand';
import { createSelectors } from './utils';
const matchesStoreBase = create()((set) => ({
    matches: [],
    currentMatchedUser: '',
    setMatchedUser: (matchedUserId) => set((_state) => ({ currentMatchedUser: matchedUserId })),
    setMatches: (matches) => set((_state) => ({ matches: matches })),
    chats: new Map(),
    setMatchChats: (matchChats) => set((_state) => ({ chats: matchChats })),
}));
const matchesStore = createSelectors(matchesStoreBase);
export default matchesStore;
//# sourceMappingURL=matchesStore.js.map