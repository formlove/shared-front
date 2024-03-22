declare interface EnumVariant<T, D> {
  type: T;
  data: D;
}

declare type Option<T> = T | null;
