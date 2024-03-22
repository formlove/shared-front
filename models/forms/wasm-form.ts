import type { DateType, Id } from "../index";

export interface Container {
  id: Id;
  name: string;
  description: string;
  // tags: string[] // TODO
  userId: Id;
  created: DateType;
  updated: DateType;
  repId: Id;
  visible: ContainerVisible;
}

// репозиторий, то есть репозиторий кода, на основе которого будет создаваться контейнер
export interface Repository {
  id: Id;
  name: string;
  url: string;
  created: DateType;
  updated: DateType;
  userId: Id;
}

export interface WasmFormSettings {
  ipAddr: number;
}

export interface WasmForm {
  // id: Id, // same
  // name: string, // same title
  // description: string, // same
  // userId: Id, // same
  // ipAddr?: string, // only for func
  // deleted: boolean, // same
  // createdDate: DateType, // same
  containerId: number; // only for func
  // body: FuncBody[]
  // invited: ???
  settings: WasmFormSettings;
}

// export type FormFieldValue = { name: string, value: any }
//
// export type FuncAnswer = {
//   fields: FormFieldValue[]
// }

// TODO: session, request, response?

export const enum ContainerVisible {
  Public = "Public",
  Contacts = "Contacts",
  Private = "Private",
}
