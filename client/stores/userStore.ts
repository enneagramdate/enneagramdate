import { create } from 'zustand';
import { createSelectors } from './utils';
import { EnneagramType, User, UserId, SwipeCache } from '../types';

export interface UserState {
  elementId: UserId | null;
  enneagramType: EnneagramType | null;
  name: string | null;
  age: number | null;
  imgUrl: string[] | null;
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
