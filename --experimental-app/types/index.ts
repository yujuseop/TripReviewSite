export * from "./travel";

export interface Profile {
  id?: string;
  nickname: string;
  email?: string;
  role?: string;
  profile_image?: string;
  bio?: string;
  created_at?: string;
  updated_at?: string;
}

export interface AuthUser {
  id: string;
  email: string;
  user_metadata?: {
    nickname?: string;
    role?: string;
  };
}
