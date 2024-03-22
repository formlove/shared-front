import type { FieldType } from "../common";

export interface MultipleSelectField {
  options: string[];
  selectedMin: number | null; // минимальное количество выбранных значений
  selectedMax: number | null; // максимальное количество выбранных значений
  useCustomOption: boolean; // возможность написать свое значение
  required: boolean;
  defaultValues: string[] | null;
}

export type MultipleSelectFormField = EnumVariant<
  FieldType.MultipleSelect,
  MultipleSelectField
>;

export function getDefault(): MultipleSelectField {
  return {
    options: [],
    selectedMin: null,
    selectedMax: null,
    useCustomOption: false,
    required: false,
    defaultValues: null,
  };
}

export default {
  getDefault,
};
