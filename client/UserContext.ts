import { createContext, useContext, useState } from 'react';

// see: https://github.com/remix-run/react-router/blob/dev/examples/auth-router-provider/src/auth.ts
// stackblitz version: https://stackblitz.com/github/remix-run/react-router/tree/main/examples/auth-router-provider?file=src%2FApp.tsx

export interface UserState {
  userId: string | null;
  setUserId: () => void;
}

export const UserContext = createContext<UserState>({
  userId: null, // set a default userId
  setUserId: () => {
    // populate user fields
    // check if we have a cookie, if so userId = cookie value
  },
});

// interface UserProvider {
//   userId: string | null;
//   setUserId: () => void;
//   clearUserId: () => void;
// }

// export const UserProvider: UserProvider = {
//   userId: null,
//   setUserId: () => {
//     // check local storage and/or anywhere else for user's id
//     const userId = 'placeholder';
//     // then set user's id
//     UserProvider.userId = userId;
//   },
//   clearUserId: () => {
//     UserProvider.userId = null;
//   },
// };
