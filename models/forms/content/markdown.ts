import type { FormItemType } from "../common";

export interface Markdown {
  text: string;
}

export type FormItemMarkdown = EnumVariant<FormItemType.Markdown, Markdown>;
