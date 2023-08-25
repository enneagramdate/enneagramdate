import { create } from 'zustand';
import { createSelectors } from './utils';
import { EnneagramType, UserId } from '../types';

export interface UserState {
  userId: UserId;
  userType: EnneagramType;
  setUserState: (id: string, type: string) => void;
  clearUserState: () => void;
}

const userStoreBase = create<UserState>()((set) => ({
  userId: null,
  userType: null,
  setUserState: (id: UserId, type: EnneagramType) =>
    set((_state) => ({ userId: id, userType: type })),
  clearUserState: () => set((_state) => ({ userId: null, userType: null })),
}));

// create an automatic selector-generating store:
const userStore = createSelectors(userStoreBase);

export default userStore;
