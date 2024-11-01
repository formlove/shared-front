/**
 * типы опросов
 * */
import type { Datetime, Entry, Id } from "@libfunc/types";

import type { FormEntry, FormPage } from "./common";

export enum FormViewType {
  // классический опрос с несколькими вопросами
  Default = "Default",
  // опрос с единственным вопросом
  OneField = "OneField",
  // опрос с единственным вопросом и единственным ответом,
  // или счетчик, лайки и т.д.
  SingleVote = "SingleVote",
}

export interface StaticFormSettings {
  // onlyWithURL: boolean
  // isOpenPoll: boolean
  isShowVotes: boolean;
  isShowVotesAtTheEnd: boolean;
  isChangeVote: boolean;
  timeLimit: number; // 0 if not limit
}

export enum StaticFormBodyStatus {
  Published = "Published",
  Unpublished = "Unpublished",
  Replaced = "Replaced",
}

export interface StaticFormBodyId {
  formId: Id;
  status: StaticFormBodyStatus;
  version: Id;
}

export interface StaticFormData {
  pages: FormPage[];
}

export interface StaticFormBody {
  // version: Id;
  // formId: Id; // TODO
  data: StaticFormData;
  created: Datetime;
}

export type FormBodyEntry = Entry<StaticFormBody, StaticFormBodyId>;

export enum StaticFormType {
  Poll = "Poll",
  Form = "Form",
}

// опрос
export interface StaticForm {
  // id: Id
  // createdDate: DateType
  viewType: FormViewType; // poll_type in db
  type: StaticFormType;
  // name: string // or title?
  // description: string
  settings: StaticFormSettings;
  // userId: Id
  // deleted: boolean
  // invited: any // TODO: ??
  // version, dataVersions, dataVersion?
  version: string;
  dataVersion: number;
}

export interface FormResponse {
  form: FormEntry;
  body: {
    published: FormBodyEntry | null;
    draft: FormBodyEntry | null;
  };
}
