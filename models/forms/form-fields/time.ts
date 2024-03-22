import type { FieldType } from "../common";

export interface TimeField {
  min: number | null;
  max: number | null;
  step: string; // 1ms, 1s, 5s, 1m, 5m, 30m, 1h
  defaultValue: Option<number>;
  required: boolean;
}

export type TimeFormField = EnumVariant<FieldType.Time, TimeField>;

export default {
  getDefault: (): TimeField => ({
    min: null,
    max: null,
    step: "1ms",
    defaultValue: null,
    required: false,
  }),
};
