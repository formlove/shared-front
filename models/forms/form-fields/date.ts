import type { FieldType } from "../common";

export interface DateField {
  min: number | null;
  max: number | null;
  step: string; // 1d, 7d, 1m, 1y...
  defaultValue: number | null;
  required: boolean;
}

// export type DateFormField = EnumVariant<FieldType.Date, DateField>;

export default {
  getDefault: (): DateField => ({
    min: null,
    max: null,
    step: "1d",
    defaultValue: null,
    required: false,
  }),
};
