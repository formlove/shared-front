import { jsonValueSchema } from "./scheme";
import { FieldType, Typ } from "./ty";
import type { Scheme } from "./types";

type Cursor = { value: number };

const getLen = (view: DataView, cursor: Cursor) => {
  const len = view.getUint32(cursor.value, true);
  cursor.value += 4;
  return len;
}

const getString = (view: DataView, cursor: Cursor) => {
  const len = getLen(view, cursor);
  const u8arr = new Uint8Array(view.buffer, cursor.value, len);
  cursor.value += len;
  const utf8decoder = new TextDecoder();
  const str = utf8decoder.decode(u8arr);
  return str;
}

export const fromSlice = (
  view: DataView,
  scheme: Scheme,
  cursor: Cursor,
): unknown => {
  switch (scheme.type) {
    case Typ.Bool: {
      const u8 = view.getUint8(cursor.value);
      cursor.value++;
      return u8 !== 0;
    }
    case Typ.U8: {
      const u8 = view.getUint8(cursor.value);
      cursor.value++;
      return u8;
    }
    case Typ.U16: {
      const u16 = view.getUint16(cursor.value, true);
      cursor.value += 2;
      return u16;
    }
    case Typ.U32: {
      const num = view.getUint32(cursor.value, true);
      cursor.value += 4;
      return num;
    }
    case Typ.U64: {
      const i64 = view.getBigUint64(cursor.value, true);
      const num = Number(i64);
      cursor.value += 8;
      return num;
    }
    case Typ.I32: {
      const num = view.getInt32(cursor.value, true);
      cursor.value += 4;
      return num;
    }
    case Typ.I64: {
      const i64 = view.getBigInt64(cursor.value, true);
      const num = Number(i64);
      cursor.value += 8;
      return num;
    }
    case Typ.F32: {
      const num = view.getFloat32(cursor.value, true);
      cursor.value += 4;
      return num;
    }
    case Typ.F64: {
      const num = view.getFloat64(cursor.value, true);
      cursor.value += 8;
      return num;
    }
    case Typ.Str: {
      return getString(view, cursor);
    }
    case Typ.Datetime: {
      const i64 = view.getBigInt64(cursor.value, true);
      const num = Number(i64);
      const date = new Date(num);
      cursor.value += 8;
      return date;
    }
    case Typ.Timestamp: {
      const u64 = view.getBigUint64(cursor.value, true);
      const num = Number(u64);
      const date = new Date(num);
      cursor.value += 8;
      return date;
    }
    case Typ.ID: {
      const utf8decoder = new TextDecoder();
      const u8arr = new Uint8Array(view.buffer, cursor.value, 13);
      cursor.value += 13;
      const str = utf8decoder.decode(u8arr);
      return str;
    }
    case Typ.Bytes: {
      const len = view.getUint32(cursor.value, true);
      cursor.value += 4;
      const u8arr = new Uint8Array(view.buffer, cursor.value, len);
      cursor.value += len;
      return u8arr;
    }
    case Typ.ArrayBytes: {
      const len = scheme.data;
      const u8arr = new Uint8Array(view.buffer, cursor.value, len);
      cursor.value += len;
      return u8arr;
    }
    case Typ.Array: {
      const [len, child] = scheme.data;
      const vec = [];
      for (let index = 0; index < len; index++) {
        const item = fromSlice(view, child, cursor);
        vec.push(item);
      }
      return vec;
    }
    case Typ.Vec: {
      const u32 = view.getUint32(cursor.value, true);
      cursor.value += 4;
      const vec = [];
      for (let index = 0; index < u32; index++) {
        const item = fromSlice(view, scheme.data, cursor);
        vec.push(item);
      }
      return vec;
    }
    case Typ.Optional: {
      const exist = view.getUint8(cursor.value) !== 0;
      cursor.value++;
      if (exist) {
        const val = fromSlice(view, scheme.data, cursor);
        return val;
      } else {
        return null;
      }
    }
    case Typ.SimpleEnum: {
      const variantVal = view.getUint8(cursor.value);
      cursor.value++;
      const name = scheme.data.variants[variantVal];
      return name;
    }
    case Typ.Struct: {
      switch (scheme.data.fields.type) {
        case FieldType.Named: {
          const struct: Record<string, unknown> = {};
          for (const [name, field] of scheme.data.fields.data) {
            const item = fromSlice(view, field, cursor);
            struct[name] = item;
          }
          return struct;
        }
        case FieldType.Unnamed: {
          const tuple: unknown[] = [];
          for (const field of scheme.data.fields.data) {
            const item = fromSlice(view, field, cursor);
            tuple.push(item);
          }
          return tuple;
        }
        default:
          throw Error(
            `unknown fields type: ${JSON.stringify(scheme.data.fields)}`,
          );
      }
    }
    case Typ.Enum: {
      const variantVal = view.getUint8(cursor.value);
      cursor.value++;
      const [name, variant] = scheme.data.variants[variantVal];
      const data = fromSlice(view, variant, cursor);
      return { type: name, data };
    }
    case Typ.Void:
      return undefined;
    case Typ.Json: {
      return fromSlice(view, jsonValueSchema, cursor);
    }
    case Typ.JsonBytes: {
      const str = getString(view, cursor);
      return JSON.parse(str);
    }
    case Typ.Custom: {
      throw Error(`unhandled type: ${JSON.stringify(scheme)}`);
    }
    // case Typ.Tuple: {
    //   const tuple: unknown[] = [];
    //   for (const field of scheme.data) {
    //     const item = fromSlice(view, field, cursor);
    //     tuple.push(item);
    //   }
    //   return tuple;
    // }
    default:
      throw Error(`unhandled type: ${JSON.stringify(scheme)}`);
  }
};
