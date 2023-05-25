import { getFloat16, setFloat16 } from '@petamoriken/float16';

declare global {
  interface DataView {
    getFloat16(byteOffset: number, littleEndian?: boolean): number;
    setFloat16(byteOffset: number, value: number, littleEndian?: boolean): void;
  }
}

DataView.prototype.getFloat16 = function (byteOffset: number, littleEndian?: boolean) {
  return getFloat16(this, byteOffset, littleEndian);
};

DataView.prototype.setFloat16 = function (
  byteOffset: number,
  value: number,
  littleEndian?: boolean,
) {
  return setFloat16(this, byteOffset, value, littleEndian);
};
