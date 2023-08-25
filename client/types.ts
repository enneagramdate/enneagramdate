export type EnneagramType = string | null;

export type UserId = string | null;

export interface User {
  id: UserId;
  enneagramType: EnneagramType;
  name: string;
  imgUrl: string; // S3 url
}
