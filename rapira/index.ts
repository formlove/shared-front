import { fromSlice } from "./from-slice";
import type { JsKeyType} from "./ty";
import { KeyType } from "./ty";
import type { KeyScheme, Scheme } from "./types";
import { KeySchemeType } from "./types";

export { sch } from "./scheme";
export type { NamedFields, StructType, KeyScheme, Scheme } from "./types";
export { KeySchemeType } from "./types";
export { Typ, FieldType } from "./ty";

// deserialize single value
export const valDeser = (view: DataView, scheme: Scheme) => {
  const cursor = { value: 0 };
  // const time = performance.now();
  const item = fromSlice(view, scheme, cursor);
  // const timeEnd = performance.now();
  // console.info("one item deserialize", timeEnd - time);
  return item;
};

export const vecDeser = (view: DataView, scheme: Scheme) => {
  const arr = [];
  const cursor = { value: 0 };
  // const time = performance.now();
  while (cursor.value < view.byteLength) {
    const val = fromSlice(view, scheme, cursor);
    arr.push(val);
  }
  // const timeEnd = performance.now();
  // console.info("vec deserialize", timeEnd - time);
  return arr;
};

// deserialize key
const keyDeser = (
  view: DataView,
  scheme: KeyScheme,
  cursor: { value: number },
): JsKeyType => {
  switch (scheme.type) {
    case KeySchemeType.Typed: {
      const arr = [];
      for (const item of scheme.data) {
        switch (item) {
          case KeyType.U8: {
            const u8 = view.getUint8(cursor.value);
            arr.push(u8);
            cursor.value++;
            break;
          }
          case KeyType.U32: {
            const num = view.getUint32(cursor.value);
            arr.push(num);
            cursor.value += 4;
            break;
          }
          case KeyType.U64: {
            const num = view.getBigUint64(cursor.value);
            arr.push(num);
            cursor.value += 4;
            break;
          }
          default:
            throw Error(`unhandled type in key: ${JSON.stringify(item)}`);
        }
      }
      return arr.join("");
    }
    case KeySchemeType.Array: {
      const len = scheme.data;
      const bytes = new Uint8Array(view.buffer, cursor.value, len);
      cursor.value += len;
      return Array.from(bytes)
        .map((i) => i.toString(16).padStart(2, "0"))
        .join("");
    }
    case KeySchemeType.Bytes: {
      const len = view.getUint32(cursor.value, true);
      cursor.value += 4;
      const bytes = new Uint8Array(view.buffer, cursor.value, len);
      cursor.value += len;
      return Array.from(bytes)
        .map((i) => i.toString(16).padStart(2, "0"))
        .join("");
    }
  }
};

export const entryDeser = (
  view: DataView,
  keyScheme: KeyScheme,
  valScheme: Scheme,
  cursor: { value: number },
): { key: number[] | string; val: unknown } => {
  const key = keyDeser(view, keyScheme, cursor);
  const val = fromSlice(view, valScheme, cursor);
  return { key, val };
};

export const vecEntryDeser = (
  view: DataView,
  keyScheme: KeyScheme,
  valScheme: Scheme,
) => {
  const arr = [];
  const cursor = { value: 0 };
  // const time = performance.now();
  while (cursor.value < view.byteLength) {
    const entry = entryDeser(view, keyScheme, valScheme, cursor);
    arr.push(entry);
  }
  // const timeEnd = performance.now();
  // console.info("vec deserialize", timeEnd - time);
  return arr;
};

export const stringify = (item: unknown): string => {
  if (typeof item === "string") {
    return item;
  }
  if (typeof item === "number") {
    return item.toString();
  }
  if (typeof item === "object") {
    if (item instanceof Date) {
      return item.toISOString();
    }
    if (item === null) {
      return "";
    }
    if (item instanceof Uint8Array) {
      return `Uint8Array with len: ${item.length}`;
    }

    return JSON.stringify(item);
  }

  return "";
};
