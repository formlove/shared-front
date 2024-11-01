import type { FieldType } from "../common";

export enum TextFieldOptionType {
  Any = "Any",
  Url = "Url",
  Email = "Email",
  Phone = "Phone",
  Regex = "Regex",
}

export type TextFieldPhoneData = string[];
export type TextFieldRegexData = string;

export interface TextFieldAny {
  type: TextFieldOptionType.Any;
}

export interface TextFieldUrl {
  type: TextFieldOptionType.Url;
}

export interface TextFieldEmail {
  type: TextFieldOptionType.Email;
}

export interface TextFieldPhone {
  type: TextFieldOptionType.Phone;
  data: TextFieldPhoneData;
}

export interface TextFieldRegex {
  type: TextFieldOptionType.Regex;
  data: TextFieldRegexData;
}

export type TextFieldOption =
  | TextFieldAny
  | TextFieldUrl
  | TextFieldEmail
  | TextFieldPhone
  | TextFieldRegex;

export interface TextField {
  min: number | null;
  max: number | null;
  required: boolean;
  defaultValue: string | null;
  option: TextFieldOption;
  // data: {
  //   regex: string | null
  // } | null
}

export type TextFormField = EnumVariant<FieldType.Text, TextField>;

export default {
  getDefault: (): TextField => ({
    min: 0,
    max: 500,
    defaultValue: null,
    option: { type: TextFieldOptionType.Any },
    required: false,
    // data: { regex: null },
  }),
};
