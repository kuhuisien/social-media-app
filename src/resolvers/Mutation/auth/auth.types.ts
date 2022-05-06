export interface ISignupAgrs {
  credentials: {
    email: string;
    password: string;
  };
  name: string;
  bio: string;
}

export interface ISigninAgrs {
  credentials: {
    email: string;
    password: string;
  };
}

export interface IUserPayload {
  userErrors: { message: string }[];
  token: string | null;
  expiresIn: number;
}
