import type { FieldType } from "../common";

export interface NumberField {
  min: number | null;
  max: number | null;
  step: number | null;
  required: boolean;
  defaultValue: number | null;
}

export type NumberFormField = EnumVariant<FieldType.Number, NumberField>;

export function getDefault(): NumberField {
  return {
    min: null,
    max: null,
    step: 1,
    defaultValue: null,
    required: false,
  };
}

export default {
  getDefault,
};
