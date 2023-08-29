import { create } from 'zustand';
import { createSelectors } from './utils';
import {
  EnneagramType,
  UserId,
  SwipeCache,
  UserLocation,
  ActiveUser,
} from '../types';

export interface UserState {
  // userInfo: ActiveUser
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
  location: UserLocation | null;
  seekRelationship: string | null;
  email: string | null;
  swipes: SwipeCache;
  updateSwipes: (updatedCache: SwipeCache) => void;
  clearSwipes: () => void;
  setUserState: (
    id: string,
    type: string,
    name: string,
    age: number,
    imgUrl: string[]
  ) => void;
  clearUserState: () => void;
}

const userStoreBase = create<UserState>()((set) => ({
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
  location: null,
  seekRelationship: null,
  email: null,
  setUserState: (
    id: UserId,
    enneagramType: EnneagramType,
    name: string,
    age: number,
    imgUrl: string[]
  ) => set((_state) => ({ id, enneagramType, name, age, imgUrl })),
  clearUserState: () =>
    set((_state) => ({
      id: null,
      enneagramType: null,
      name: null,
      age: null,
      imgUrl: null,
    })),
  swipes: new Map(),
  updateSwipes: (updatedCache: SwipeCache) =>
    set((_state) => ({ swipes: updatedCache })),
  clearSwipes: () => set((_state) => ({ swipes: new Map() })),
}));

// create an automatic selector-generating store:
const userStore = createSelectors(userStoreBase);

export default userStore;
