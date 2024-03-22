import type { FieldType } from "../common";

export interface FileField {
  required: boolean;
}

export type FileFormField = EnumVariant<FieldType.File, FileField>;

export function getDefault(): FileField {
  return {
    required: false,
  };
}

export default {
  getDefault,
};
