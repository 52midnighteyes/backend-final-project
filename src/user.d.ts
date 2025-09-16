export interface IUserParams {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  avatar?: string | null;
  role: string;
}

declare global {
  namespace Express {
    export interface Request {
      user?: IUserParams;
    }
  }
}
