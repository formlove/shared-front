import type { DateType, Datetime, Entry, Id } from "@libfunc/types";

import type { Img } from "./image";

export type PhoneOrEmail = { phone: string } | { email: string };

export const enum WebVisibility {
  Open = "Open",
  Hidden = "Hidden",
}

export interface UserSettings {
  webVisibility: WebVisibility;
}

export interface User {
  avatars: Img[];
  username: string;
  description: string;
  firstname: string;
  lastname: string;
  created: Datetime;
  updated: Datetime;
  email: string;
  phone: string;
  settings: Option<UserSettings>;
}

export type UserEntry = Entry<User>;

export interface UserSession {
  id: Id;
  userId: Id;
  created: DateType;
  last: DateType;
  deviceId: string;
}

export const enum UserIdentityType {
  Phone = "Phone",
  Email = "Email",
  Username = "Username",
}
export interface UserIdentity {
  type: UserIdentityType;
  data: string;
}
