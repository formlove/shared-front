export const enum PhoneOrEmailField {
  phone = "phone",
  email = "email",
}

export const enum UserIdentityType {
  phone = "phone",
  email = "email",
  username = "username",
}

// identification
export type Id = string;

export interface Uid<E = RecordStatus> {
  id: Id;
  status: E;
}

export const enum RecordStatus {
  Active = "Active",
  Disabled = "Disabled",
  Deleted = "Deleted",
}

// export type Gid = Uid<RecordStatus>

export type Entry<T, ID = Uid> = T & ID;

export type DateType = Date;
export type Datetime = string;
export type Timestamp = string;

export type { User } from "./user";

export const enum Space {
  User = "User",
  Org = "Org",
}

export type SpaceId = EnumVariant<Space.User, Id> | EnumVariant<Space.Org, Id>;

export interface UserIdentity {
  type: UserIdentityType;
  data: string;
}

// e81800dca5-242-e806
// `${ts}-${shardId}-${rand}` where ts: 5 bytes hex, shardId: 0-255, rand: 2 bytes hex
export type Fuid = `${string}-${string}-${string}`;
