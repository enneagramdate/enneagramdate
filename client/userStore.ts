import { create } from 'zustand';

export type EnneagramType = string | number;
export type UserId = string | number;

export interface UserState {
  userId: UserId | null;
  userType: EnneagramType | null;
  setUserState: (id: string | number, type: string | number) => void;
  clearUserState: () => void;
}

const userStore = create<UserState>()((set) => ({
  userId: null,
  userType: null,
  setUserState: (id: UserId, type: EnneagramType) =>
    set((_state) => ({ userId: id, userType: type })),
  clearUserState: () => set((_state) => ({ userId: null, userType: null })),
}));

export default userStore;
