import type { Fuid } from ".";

export interface ImageInfo {
  width: number;
  height: number;
  size: number;
  filename: string;
  mime: string;
  hash: string;
  thumbhash: string;
  alt: string;
}

export interface Img {
  imgId: Option<Fuid>;
  cfId: string;
  width: number;
  height: number;
  thumbhash: string;
  hash: Option<string>;
}
