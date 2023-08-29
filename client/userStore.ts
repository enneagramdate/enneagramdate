import { create } from 'zustand';

export type EnneagramType = string | number;
export type UserId = string | number;

export interface UserState {
  userId: UserId | null;
  userType: EnneagramType | null;
  setUserState: (user: UserState) => void;
  clearUserState: () => void;
}

const userStore = create<UserState>()((set) => ({
  userId: null,
  userType: null,
  setUserState: (user: UserState) => set((_state) => user),
  clearUserState: () => set((_state) => ({ userId: null, userType: null })),
}));

export default userStore;
