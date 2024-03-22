/*
 * как хранить ответы? хранить id ответа, или их значения?
 * значения удобнее хранить, в опросе могут быть свои значения,
 * значения могут удаляться, добавляться...
 * */
import type { Id } from "../index";
import type { FieldType } from "./common";

// export const enum PollAnswerType {
//   Select = "Select",
//   Several = "Several",
//   Range = "Range",
//   Number = "Number",
//   Text = "Text",
//   Date = "Date",
//   Time = "Time",
//   TimeCount = "TimeCount",
//   Users = "Users",
// }

export interface SelectAnswer {
  value: string;
  custom: boolean;
}

export interface SelectAnswerData {
  type: FieldType.Select;
  data: SelectAnswer;
}

export interface SeveralAnswerValue {
  value: string;
  custom: boolean;
}

export interface SeveralAnswer {
  values: SeveralAnswerValue[];
}

export interface SeveralAnswerData {
  type: FieldType.MultipleSelect;
  data: SeveralAnswer;
}

export interface RangeAnswerValue {
  min: number;
  max: number;
}

export interface RangeAnswer {
  value: RangeAnswerValue; // (f64, f64)
}

// export interface GeolocationAnswerValue {
//   latitude: number;
//   logitude: number;
// }

// export type GeolocationAnswer = {
//   value:  GeolocationAnswerValue // (f64, f64)
// }

// date item (year, month, week, weekday, monthday, hour, minute/second)???
export interface DateAnswer {
  value: number | null; // u64 // date, time, datetime
}

export interface DateAnswerData {
  type: FieldType.Date;
  data: DateAnswer;
}

export interface TimeAnswer {
  value: number | null; // u64 // date, time, datetime
}

export interface TimeAnswerData {
  type: FieldType.Time;
  data: TimeAnswer;
}

export interface TimeCountAnswer {
  value: number | null; // u64
}

export interface NumberAnswer {
  value: number | null; // f64
}

export interface NumberAnswerData {
  type: FieldType.Number;
  data: NumberAnswer;
}

export interface TextAnswer {
  value: string;
}

export interface TextAnswerData {
  type: FieldType.Text;
  data: TextAnswer;
}

export interface UsersAnswer {
  value: string[]; // @user
}

// типы ответов на вопросы
export type FormFieldAnswerTypes =
  | SelectAnswer
  | SeveralAnswer
  | RangeAnswer
  | NumberAnswer
  | TextAnswer
  | DateAnswer
  | TimeAnswer
  | TimeCountAnswer
  | UsersAnswer;
// | GeolocationAnswer

export type FormFieldAnswerDataTypes =
  | SelectAnswerData
  | SeveralAnswerData
  | NumberAnswerData
  | TextAnswerData
  | DateAnswerData
  | TimeAnswerData;

// ответ на вопрос
export interface FormFieldAnswer {
  formFieldName: string;
  data: FormFieldAnswerDataTypes;
}

// ответы на опрос
export interface Vote {
  id: Id; // TODO
  created: number;
  formId: Id; // TODO
  votedUserId: Id;
  // userId: number
  // pollId: Id // TODO
  items: FormFieldAnswer[];
  buttonId: string;
  pollVersion?: Id; // only for Poll
}

// export interface VotePollBody {
//   vote: Vote
// }
