import type { Float16ArrayConstructor } from '@petamoriken/float16';
import { wgsl } from './StructBuffer';

declare global {
  interface DataView {
    getFloat16(byteOffset: number, littleEndian?: boolean): number;
    setFloat16(byteOffset: number, value: number, littleEndian?: boolean): void;
  }
}

export function setPolyfill(polyfill: {
  getFloat16: any;
  setFloat16: any;
  Float16Array: Float16ArrayConstructor;
}) {
  const { getFloat16, setFloat16, Float16Array } = polyfill;
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

  (wgsl.SuffixTypedArrayMap as any).h = Float16Array;
}
