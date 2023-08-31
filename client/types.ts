export type EnneagramType = string;
export type UserLocation = [long: number, lat: number];

export type UserId = string;
export type RecId = string;

export interface RecommendedUser {
  elementId: UserId;
  enneagramType: EnneagramType;
  name: string;
  age: number;
  imgUrl: string[]; // array of S3 urls
}

export interface ActiveUser {
  elementId: UserId | null;
  enneagramType: EnneagramType | null;
  name: string | null;
  age: number | null;
  imgUrl: string[] | null; // array of S3 urls
  gender: string | null;
  seekGender: string | null;
  birthday: string | null;
  seekAgeRange: number[] | null;
  seekRadius: number | null;
  location: UserLocation | null;
  seekRelationship: string | null;
  email: string | null;
}

// export type RecsMap = Map<UserId, User>;
export type Swipe = 'like' | 'dislike';
export type SwipeCache = Map<RecId, Swipe>;
export type Matches = Set<RecommendedUser>;
export type Message = {
  message: string;
  time: string;
  sender: UserId;
  room: string;
};
export type ChatLog = Message[];
export type MatchChats = Map<UserId, ChatLog>;
// export type SwipeCache = Map<SwipeRelationship, Swipe>;
// export interface SwipeCache {
//   [key: UserId]: Swipe
// }

// type SwipeRelationship = {
//   swiper: UserId;
//   swipee: UserId;
// };
