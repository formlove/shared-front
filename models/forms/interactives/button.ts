import type { FormItemType } from "../common";

export interface Button {
  name: string;
  text: string;
}

export type FormItemButton = EnumVariant<FormItemType.Button, Button>;
