import type { FieldType } from "../common";

export interface SelectField {
  options: string[];
  useCustomOption: boolean; // возможность написать свое значение
  // обязательно для выбора
  required: boolean;
  defaultValue: Option<string>;
}

export type SelectFormField = EnumVariant<FieldType.Select, SelectField>;

export default {
  getDefault(): SelectField {
    return {
      useCustomOption: false,
      options: [],
      required: false,
      defaultValue: null,
    };
  },
};
