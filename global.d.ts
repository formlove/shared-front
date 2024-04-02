declare interface EnumVariant<T, D = undefined> {
  type: T;
  data: D;
}

declare type Option<T> = T | null;
