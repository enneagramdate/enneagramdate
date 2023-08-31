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
  elementId: UserId | null;
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
  info: UserInfo;
  swipes: SwipeCache;
  updateSwipes: (updatedCache: SwipeCache) => void;
  clearSwipes: () => void;
  setUserState: (user: UserInfo) => void;
  clearUserState: () => void;
}

const emptyUser = {
  elementId: null,
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
  info: emptyUser,
  setUserState: (user: UserInfo) =>
    set((_state) => {
      _state.info = user;
      return _state;
    }),
  clearUserState: () =>
    set((_state) => {
      _state.info = emptyUser;
      return _state;
    }),
  swipes: new Map(),
  updateSwipes: (updatedCache: SwipeCache) =>
    set((_state) => ({ swipes: updatedCache })),
  clearSwipes: () => set((_state) => ({ swipes: new Map() })),
}));

// create an automatic selector-generating store:
const userStore = createSelectors(userStoreBase);

export default userStore;
