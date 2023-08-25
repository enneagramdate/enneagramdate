import { create } from 'zustand';
import { createSelectors } from './utils';
import { EnneagramType, User, UserId } from '../types';

export interface UserState {
  id: UserId | null;
  enneagramType: EnneagramType | null;
  name: string | null;
  age: number | null;
  imgUrl: string | string[] | null;
  setUserState: (
    id: string,
    type: string,
    name: string,
    age: number,
    imgUrl: string | string[]
  ) => void;
  clearUserState: () => void;
}

const userStoreBase = create<UserState>()((set) => ({
  id: null,
  enneagramType: null,
  name: null,
  age: null,
  imgUrl: null,
  setUserState: (
    id: UserId,
    enneagramType: EnneagramType,
    name: string,
    age: number,
    imgUrl: string | string[]
  ) => set((_state) => ({ id, enneagramType, name, age, imgUrl })),
  clearUserState: () =>
    set((_state) => ({
      id: null,
      enneagramType: null,
      name: null,
      age: null,
      imgUrl: null,
    })),
}));

// create an automatic selector-generating store:
const userStore = createSelectors(userStoreBase);

export default userStore;
