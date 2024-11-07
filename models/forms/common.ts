import type { Datetime, Entry, Id } from "@libfunc/types";

import type { User } from "../user";
import type { FormItemImage } from "./content/image";
import type { FormItemMarkdown } from "./content/markdown";
import type {
  DateField,
  DateFormField,
  ImageField,
  ImageFormField,
  MultipleSelectField,
  MultipleSelectFormField,
  NumberField,
  NumberFormField,
  SelectField,
  SelectFormField,
  TextField,
  TextFormField,
  TimeField,
  TimeFormField,
} from "./form-fields";
import type { FormItemButton } from "./interactives/button";
import type { StaticForm } from "./static-form";
import type { WasmForm } from "./wasm-form";

/**
 * типы вопросов, перечисление
 * */
export enum FieldType {
  // конкретный ответ из конкретных значений
  Select = "Select",

  // несколько ответов из конкретных значений
  MultipleSelect = "MultipleSelect",

  // диапазон значений (с шагом), например от 1000 до 2000 (с шагом в 500)
  // Range = "Range",

  // указывается некоторая величина (с двумя цифрами после запятой или целое число): 35, 192.22, 100000
  Number = "Number",

  // указывается конкретное строковое значение
  // email, phone, regex
  Text = "Text",

  // указывается конкретное время (в зависимости от точности: секунды, минуты, часы, дни, недели, месяцы, годы)
  // например: 31 декабря 2017 года
  Date = "Date",

  // например: в 12 часов 30 минут
  Time = "Time",

  // указывается время в количестве (в зависимости от точности: секунды, минуты, часы, дни, недели, месяцы, годы)
  // например: двое суток и 6 часов = 54 часа
  // TimeCount = "TimeCount",

  // загрузка файла
  File = "File",
}

export type FieldTypes =
  | SelectField
  | MultipleSelectField
  | NumberField
  | TextField
  | DateField
  | TimeField
  | ImageField;

// типы полезной нагрузки для вопросов
export type FormFieldTypes =
  | SelectFormField
  | MultipleSelectFormField
  | NumberFormField
  | TextFormField
  | DateFormField
  | TimeFormField
  | ImageFormField;

// вопрос
// text, type, data
export interface FormField {
  name: string; // должен быть уникальным в пределах массива всех вопросов
  text: string;
  formFieldData: FormFieldTypes;
}

export enum FormItemType {
  FormField = "FormField",
  Markdown = "Markdown",
  Image = "Image",
  Button = "Button",
}

export type FormItemFormField = EnumVariant<FormItemType.FormField, FormField>;

export type FormItemDataTypes =
  | FormItemMarkdown
  | FormItemFormField
  | FormItemImage
  | FormItemButton;

export enum FormItemContent {
  Markdown = "Markdown",
  Image = "Image",
}

export interface FormItem {
  formItemData: FormItemDataTypes;
}

export interface FormPage {
  items: FormItem[];
}

export enum FormType {
  Static = "Static",
  Wasm = "Wasm",
}

export enum FormLinkType {
  Global = "Global",
  Branded = "Branded",
  Named = "Named",
}

export type FormData =
  | EnumVariant<FormType.Static, StaticForm>
  | EnumVariant<FormType.Wasm, WasmForm>;

export interface FormSettings {
  onlyWithURL: boolean;
  isOpenPoll: boolean;
  anonymous: boolean;
}

export enum FormStatus {
  Released = "Released",
  Draft = "Draft",
  Disabled = "Disabled",
  Deleted = "Deleted",
}

export interface FormId {
  id: Id;
  status: FormStatus;
}

export interface Form {
  id: Id;
  name: string;
  description: string;
  created: Datetime;
  deleted: boolean;
  settings: FormSettings;
  formData: FormData;
  formLinkType: FormLinkType;
  userId: Id;
  user?: Option<User>;
  image: string | null;
}

export type FormEntry = Entry<Form, FormId>;

export interface DraftFormData {
  name: string;
  description: string;
  items: FormItem[];
}
