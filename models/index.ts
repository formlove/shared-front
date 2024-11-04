export enum PhoneOrEmailField {
  phone = "phone",
  email = "email",
}

export enum UserIdentityType {
  phone = "phone",
  email = "email",
  username = "username",
}

export type { User } from "./user";

export interface UserIdentity {
  type: UserIdentityType;
  data: string;
}
