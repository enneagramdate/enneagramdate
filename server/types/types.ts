import { Request, Response, NextFunction } from 'express';

interface AsyncError {
  log: string;
  status: number;
  message: {
    err: string;
  };
}

interface EnvVars {
  [envVar: string]: string;
}

type ExpressController = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void>;

interface ApiController {
  [controller: string]: ExpressController;
}

interface LoginUser {
  email: string;
  password: string;
}

interface SignupUser extends LoginUser {
  fullName: string;
  enneagramType: string;
  birthday: string;
  seekAgeRange: any; // unsure how to type: FE passes [number, number], but multer processing converts this to str, str
  gender: string;
  seekGender: string;
  seekRelationship: string;
  location: string;
  seekRadius: string;
}

type SeekAgeRange = [number, number];

interface User extends LoginUser {
  fullName: string;
  enneagramType: string;
  birthday: string;
  seekAgeRange: SeekAgeRange;
  gender: string;
  seekGender: string;
  seekRelationship: string;
  lat: number;
  lng: number;
  seekRadius: string;
}

interface LikeOrDislikePost {
  elementIdA: string;
  elementIdB: string;
}

export {
  AsyncError,
  EnvVars,
  ExpressController,
  ApiController,
  LoginUser,
  SignupUser,
  SeekAgeRange,
  User,
  LikeOrDislikePost,
};
