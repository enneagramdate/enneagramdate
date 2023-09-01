import { create } from 'zustand';
import { createSelectors } from './utils';
import {
  EnneagramType,
  UserId,
  SwipeCache,
  UserLocation,
  ActiveUser,
} from '../types';

export interface UserInfo {
  enneagramType: EnneagramType | null;
  name: string | null;
  age: number | null;
  imgUrl: string[] | null;
  gender: string | null;
  seekGender: string | null;
  birthday: string | null;
  seekAgeRange: number[] | null;
  seekRadius: number | null;
  lat: number | null;
  lng: number | null;
  seekRelationship: string | null;
  email: string | null;
}

export interface UserState {
  elementId: UserId | null;
  info: UserInfo;
  swipes: SwipeCache;
  updateSwipes: (updatedCache: SwipeCache) => void;
  clearSwipes: () => void;
  setUserState: (user: UserInfo, elementId: UserId) => void;
  clearUserState: () => void;
}

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
const userStoreBase = create<UserState>()((set) => ({
  elementId: null,
  info: emptyUser,
  setUserState: (user: UserInfo, elementId: UserId) =>
    set((state) => {
      state.info = user;
      state.elementId = elementId;
      return state;
    }),
  clearUserState: () =>
    set((state) => {
      state.info = emptyUser;
      state.elementId = null;
      return state;
    }),
  swipes: new Map(),
  updateSwipes: (updatedCache: SwipeCache) =>
    set((_state) => ({ swipes: updatedCache })),
  clearSwipes: () => set((_state) => ({ swipes: new Map() })),
}));

// create an automatic selector-generating store:
const userStore = createSelectors(userStoreBase);

export default userStore;
