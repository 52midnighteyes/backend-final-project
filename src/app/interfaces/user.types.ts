export interface IUpdateUserProfileParams {
  first_name?: string;
  last_name?: string;
  phone_number?: number;
  avatar?: string;
  password?: string;
  email?: string;
}

export interface IUserProfile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  avatar?: string | null;
  phone_number?: number | null;
  role: string;
  isVerified: boolean;
  created_at: Date;
}

export interface IResendVerifyEmailResponse {
  message: string;
}

export interface IConfirmVerifyEmailParams {
  token: string;
}
