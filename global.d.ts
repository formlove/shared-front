declare interface EnumVariant<T, D> {
  type: T;
  data: D;
}

declare type Id = string;

declare type Option<T> = T | null;
