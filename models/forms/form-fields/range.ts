export interface RangeField {
  min: number | null; // range.b - range.a should be >= rangeMin
  max: number | null; // range.b - range.a should be <= rangeMax
  step: number;
  rangeFrom: number; // начальная точка
  rangeTo: number; // конечная точка
  defaultValue: [number, number] | null;
}

export function getDefault(): RangeField {
  return {
    min: null,
    max: null,
    step: 1,
    rangeFrom: 0,
    rangeTo: 100,
    defaultValue: null,
  };
}

export default {
  getDefault,
};
