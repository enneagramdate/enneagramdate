export type EnneagramType = string | null;

export type UserId = string | null;
export type RecId = string;

export interface User {
  id: UserId;
  enneagramType: EnneagramType;
  name: string;
  age: number;
  imgUrl: string[]; // S3 url
}

export type RecsMap = Map<UserId, User>;
export type Swipe = 'like' | 'dislike';
export type SwipeCache = Map<RecId, Swipe>;
// export type SwipeCache = Map<SwipeRelationship, Swipe>;
// export interface SwipeCache {
//   [key: UserId]: Swipe
// }

type SwipeRelationship = {
  swiper: UserId;
  swipee: UserId;
};
