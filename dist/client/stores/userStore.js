import { create } from 'zustand';
import { createSelectors } from './utils';
const emptyUser = {
    enneagramType: null,
    name: null,
    age: null,
    imgUrl: null,
    gender: null,
    seekGender: null,
    birthday: null,
    seekAgeRange: null,
    seekRadius: null,
    lat: null,
    lng: null,
    seekRelationship: null,
    email: null,
};
const userStoreBase = create()((set) => ({
    elementId: null,
    info: emptyUser,
    setUserState: (user, elementId) => set((state) => {
        state.info = user;
        state.elementId = elementId;
        return state;
    }),
    clearUserState: () => set((state) => {
        state.info = emptyUser;
        state.elementId = null;
        return state;
    }),
    swipes: new Map(),
    updateSwipes: (updatedCache) => set((_state) => ({ swipes: updatedCache })),
    clearSwipes: () => set((_state) => ({ swipes: new Map() })),
}));
const userStore = createSelectors(userStoreBase);
export default userStore;
