import type { FormFieldTypes } from "../common";
import { FieldType } from "../common";
import date from "./date";
import file from "./file";
import multiple from "./multiple-select";
import number from "./number";
import select from "./select";
import text from "./text";
import time from "./time";

export type { SelectField, SelectFormField } from "./select";

export type {
  MultipleSelectField,
  MultipleSelectFormField,
} from "./multiple-select";

export type { NumberField, NumberFormField } from "./number";

export type { TextField, TextFormField } from "./text";

export type { DateField, DateFormField } from "./date";

export type { TimeField, TimeFormField } from "./time";

export type {
  FileField as ImageField,
  FileFormField as ImageFormField,
} from "./file";

export type { RangeField } from "./range";
export type { TimeCountField } from "./time-count";

export const getDefaults = (type: FieldType): FormFieldTypes => {
  switch (type) {
    case FieldType.Select:
      return { type: FieldType.Select, data: select.getDefault() };
    case FieldType.MultipleSelect:
      return { type: FieldType.MultipleSelect, data: multiple.getDefault() };
    case FieldType.Number:
      return { type: FieldType.Number, data: number.getDefault() };
    case FieldType.Text:
      return { type: FieldType.Text, data: text.getDefault() };
    case FieldType.Date:
      return { type: FieldType.Date, data: date.getDefault() };
    case FieldType.Time:
      return { type: FieldType.Time, data: time.getDefault() };
    case FieldType.File:
      return { type: FieldType.File, data: file.getDefault() };
  }

  // throw Error("not support FormFieldType");
};
