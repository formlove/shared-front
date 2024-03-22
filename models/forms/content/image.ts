import type { FormItemType } from "../common";

export interface Image {
  url: string;
  text: string;
  width: number;
  height: number;
}

export type FormItemImage = EnumVariant<FormItemType.Image, Image>;
