export type EnneagramType = string | null;

export type UserId = string | null;

export interface User {
  id: UserId;
  enneagramType: EnneagramType;
  name: string;
  age: number;
  imgUrl: string | string[]; // S3 url
}

export type RecsMap = Map<UserId, User>;
export type Swipe = 'like' | 'dislike';
