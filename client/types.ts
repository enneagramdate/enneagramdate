export type EnneagramType = string | null;

export type UserId = string | null;

export interface User {
  id: UserId;
  enneagramType: EnneagramType;
  name: string;
  age: number;
  imgUrl: string; // S3 url
}

export type Swipe = 'like' | 'dislike';
