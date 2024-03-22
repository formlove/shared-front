export interface TimeCountField {
  min: number | null;
  max: number | null;
  step: string; // 1ms, 1s, 5s, 1m, 5m, 30m, 1h, 2h, 12h, 1d, 7d, 1m, 1y...
  defaultValue: number | null;
  required: boolean;
}

export function getDefault(): TimeCountField {
  return {
    min: null,
    max: null,
    step: "1ms",
    defaultValue: null,
    required: false,
  };
}

export default {
  getDefault,
};
