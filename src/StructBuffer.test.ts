import { wgsl, setPolyfill } from './index';
import { expect, test } from 'vitest';
import * as polyfill from '@petamoriken/float16';

setPolyfill(polyfill);

test('StructBuffer simple', () => {
  const struct = new wgsl.StructBuffer({
    ambient: 'vec3f',
    lightCount: 'u32',
    lights: [
      {
        position: 'vec3f',
        range: 'f32',
        color: 'vec3f',
        intensity: 'f32',
      },
      4,
    ],
  });

  let i = 0;
  struct.view.ambient.set([++i, ++i, ++i]);
  struct.view.lightCount = ++i;
  struct.view.lights.forEach(light => {
    light.color.set([++i, ++i, ++i]);
    light.position.set([++i, ++i, ++i]);
    light.intensity = ++i;
    light.range = ++i;
  });

  // console.log(struct.view);
  // console.log(struct.buffer);

  i = 0;
  expect(struct.view.ambient).toStrictEqual(new Float32Array([++i, ++i, ++i]));
  expect(struct.view.lightCount).toStrictEqual(++i);
  struct.view.lights.forEach(light => {
    expect(light.color).toStrictEqual(new Float32Array([++i, ++i, ++i]));
    expect(light.position).toStrictEqual(new Float32Array([++i, ++i, ++i]));
    expect(light.intensity).toStrictEqual(++i);
    expect(light.range).toStrictEqual(++i);

    expect(() => (light.color = new Float32Array())).toThrowError();
  });

  expect(() => (struct.view.lights[2] = {} as any)).toThrowError();
  expect(() => (struct.view.lights[4] = {} as any)).toThrowError();
});

test('StructBuffer view', () => {
  const substruct = {
    vec2_0: 'vec2f',
    vec2_1: 'vec2f',
    subarray: [
      {
        f32_: 'f32',
        i32_: 'i32',
      },
      2,
    ],
  } satisfies wgsl.Struct;
  const { view, info } = new wgsl.StructBuffer(
    {
      u32_: 'u32',
      i32_: 'i32',
      f32_: 'f32',
      f16_: 'f16',

      vec2_: 'vec2f',
      vec2i_: 'vec2i',
      vec2u_: 'vec2u',
      vec2h_: 'vec2h',

      vec3_: 'vec3f',
      vec3i_: 'vec3i',
      vec3u_: 'vec3u',
      vec3h_: 'vec3h',

      vec4_: 'vec4f',
      vec4h_: 'vec4h',
      vec4i_: 'vec4i',
      vec4u_: 'vec4u',

      mat3_: 'mat3x3f',
      mat4_: 'mat4x4f',
      mat3h_: 'mat3x3h',
      mat4h_: 'mat4x4h',

      substruct: substruct,
      subarray: [substruct, 2],
    },
    false,
    true,
  );
  view.f32_ = 1;
  view.i32_ = 2;
  view.u32_ = -1;
  view.f16_ = 3.140624;
  view.vec2h_.set([0.5, 0.000030517578124]); // 注意最后一位
  view.vec3h_.set([3.140625, 3.140625]);
  view.vec4h_.set([3.140625, 3.140625]);
  console.log(info);
  expect(view.f32_).toBe(1);
  expect(view.i32_).toBe(2);
  expect(view.u32_).toBe(4294967295);
  expect(view.f16_).toBe(3.138671875);
  expect([...view.vec2h_]).toStrictEqual([0.5, 0.000030517578125]);

  expect(view.vec2_.length).toBe(2);
  expect(view.vec2_.byteOffset).toBe(info!.vec2_.offset);
  expect(view.vec3_.length).toBe(3);
  expect(view.vec3_.byteOffset).toBe(info!.vec3_.offset);
  expect(view.vec4_.length).toBe(4);
  expect(view.vec4_.byteOffset).toBe(info!.vec4_.offset);
  expect(view.mat3_.length).toBe(12);
  expect(view.mat3_.byteOffset).toBe(info!.mat3_.offset);
  expect(view.mat4_.length).toBe(16);
  expect(view.mat4_.byteOffset).toBe(info!.mat4_.offset);
  expect(view.substruct.subarray.length).toBe(2);
  expect(view.subarray.length).toBe(2);
  expect(view.subarray[0].subarray.length).toBe(2);
});

test('StructBuffer ignore align', () => {
  const { view } = new wgsl.StructBuffer(
    {
      a: 'vec2f',
      b: 'vec3f',
      c: 'vec4f',
      d: 'f32',
      e: 'mat3x3f',
      f: 'mat4x4f',
    },
    true,
  );

  expect(view.a.byteOffset).toBe(0);
  expect(view.b.byteOffset).toBe(4 * 2);
  expect(view.c.byteOffset).toBe(4 * 5);
  expect(view.e.byteOffset).toBe(4 * 10);
  expect(view.f.byteOffset).toBe(4 * 22);
});

test('StructBuffer stringifyStruct', () => {
  const substruct = wgsl.struct({
    vec2_0: 'vec2f',
    vec2_1: 'vec2f',
    subarray: [
      {
        f32_: 'f32',
        i32_: 'i32',
      },
      2,
    ],
  });
  const str = wgsl.stringifyStruct('Test', {
    u32_: 'u32',
    i32_: 'i32',
    f32_: 'f32',
    vec2_: 'vec2f',
    vec3_: 'vec3f',
    vec4_: 'vec4f',
    mat3_: 'mat3x3f',
    mat4_: 'mat4x4f',
    substruct,
    subarray: [substruct, 2],
  });
  console.log(str);
  expect(str).toBe(`struct Test_substruct_subarray {
  f32_: f32,
  i32_: i32,
};
struct Test_substruct {
  vec2_0: vec2f,
  vec2_1: vec2f,
  subarray: array<Test_substruct_subarray, 2>,
};
struct Test {
  u32_: u32,
  i32_: i32,
  f32_: f32,
  vec2_: vec2f,
  vec3_: vec3f,
  vec4_: vec4f,
  mat3_: mat3x3f,
  mat4_: mat4x4f,
  substruct: Test_substruct,
  subarray: array<Test_subarray, 2>,
};`);
});
