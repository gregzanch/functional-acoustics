import { numarrayfunction } from './num-array-function';

export const round = (value, precision = 1) => numarrayfunction(value,x => Math.round(x / precision) * precision);