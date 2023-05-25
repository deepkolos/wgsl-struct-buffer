import { device, initContext, queue, createBuffer } from './context';
import { wgsl } from '../src/StructBuffer';
import COMPUTE_SHADER from './struct-buffer.comp.wgsl?raw';

function arrayEq(a: ArrayLike<number>, b: ArrayLike<number>) {
  for (let i = 0; i < a.length; i++) {
    if (a[i] != b[i]) return false;
  }
  return true;
}

async function main() {
  const canvas = document.getElementById('gfx') as HTMLCanvasElement;
  await initContext(canvas);

  const subarray = {
    f32_: 'f32',
    i32_: 'i32',
  } satisfies wgsl.Struct;
  const substruct = {
    vec2_0: 'vec2f',
    vec2_1: 'vec2f',
    subarray: [subarray, 2],
  } satisfies wgsl.Struct;
  const struct = new wgsl.StructBuffer({
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
  console.log(wgsl.stringifyStruct('Test', struct.struct));
  const bindgroupLayout = device.createBindGroupLayout({
    entries: [{ binding: 0, buffer: { type: 'storage' }, visibility: GPUShaderStage.COMPUTE }],
  });
  const pipeline = device.createComputePipeline({
    layout: device.createPipelineLayout({ bindGroupLayouts: [bindgroupLayout] }),
    compute: { module: device.createShaderModule({ code: COMPUTE_SHADER }), entryPoint: 'main' },
  });
  const gpuBuffer = createBuffer(struct.buffer, GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC);
  const stagingBuffer = createBuffer(
    struct.buffer,
    GPUBufferUsage.MAP_READ | GPUBufferUsage.COPY_DST,
  );

  const bindgroup = device.createBindGroup({
    layout: bindgroupLayout,
    entries: [{ binding: 0, resource: { buffer: gpuBuffer } }],
  });

  const commandEncoder = device.createCommandEncoder();
  const passEncoder = commandEncoder.beginComputePass();
  passEncoder.setPipeline(pipeline);
  passEncoder.setBindGroup(0, bindgroup);
  passEncoder.dispatchWorkgroups(1);
  passEncoder.end();
  commandEncoder.copyBufferToBuffer(gpuBuffer, 0, stagingBuffer, 0, stagingBuffer.size);
  queue.submit([commandEncoder.finish()]);

  await stagingBuffer.mapAsync(GPUMapMode.READ);
  struct.buffer.set(new Uint8Array(stagingBuffer.getMappedRange()));
  stagingBuffer.unmap();

  console.log(struct.view);
  console.log(struct.buffer);
  const { view } = struct;
  const { assert } = console;

  assert(view.u32_ === 1);
  assert(view.i32_ === 2);
  assert(view.f32_ === 3);

  assert(arrayEq(view.vec2_, [4, 5]));
  assert(arrayEq(view.vec3_, [6, 7, 8]));
  assert(arrayEq(view.vec4_, [9, 10, 11, 12]));
  // prettier-ignore
  assert(arrayEq(view.mat3_, [
    13.0, 14.0, 15.0, 0, 
    16.0, 17.0, 18.0, 0, 
    19.0, 20.0, 21.0, 0,
  ]),);
  // prettier-ignore
  assert(arrayEq(view.mat4_, [
    22.0, 23.0, 24.0, 25.0, 
    26.0, 27.0, 28.0, 29.0,
    30.0, 31.0, 32.0, 33.0,
    34.0, 35.0, 36.0, 37.0,
  ]));

  assert(arrayEq(view.subarray[0].vec2_0, [46.0, 47.0]));
  assert(arrayEq(view.subarray[0].vec2_1, [48.0, 49.0]));
  assert(view.subarray[0].subarray[0].f32_ == 50);
  assert(view.subarray[0].subarray[0].i32_ == 51);
  assert(view.subarray[0].subarray[1].f32_ == 52);
  assert(view.subarray[0].subarray[1].i32_ == 53);

  assert(arrayEq(view.subarray[1].vec2_0, [54.0, 55.0]));
  assert(arrayEq(view.subarray[1].vec2_1, [56.0, 57.0]));
  assert(view.subarray[1].subarray[0].f32_ == 58);
  assert(view.subarray[1].subarray[0].i32_ == 59);
  assert(view.subarray[1].subarray[1].f32_ == 60);
  assert(view.subarray[1].subarray[1].i32_ == 61);
}

main();
