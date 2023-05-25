export let adapter: GPUAdapter;
export let device: GPUDevice;
export let queue: GPUQueue;
export let canvasCtx: GPUCanvasContext;
export let canvasFormat: GPUTextureFormat;

export async function initContext(canvas: HTMLCanvasElement) {
  // 🏭 Entry to WebGPU
  const entry: GPU = navigator.gpu;
  if (!entry) return false;

  // 🔌 Physical Device Adapter
  adapter = (await entry.requestAdapter({ forceFallbackAdapter: false }))!;

  adapter.requestAdapterInfo?.().then(console.log);
  // 💻 Logical Device
  device = await adapter.requestDevice();
  queue = device.queue;
  canvasCtx = canvas.getContext('webgpu')!;
  canvasFormat = navigator.gpu.getPreferredCanvasFormat();

  if (!canvasCtx) throw new Error('get webgpu context fail');
}

const align = (len: number, alignment: number = 4) => {
  return (len + (alignment - 1)) & ~(alignment - 1);
};

export function createBuffer(
  data: Float32Array | Uint32Array | Uint8Array | Uint16Array,
  usage: GPUFlagsConstant,
  mappedAtCreation = false,
  alignment = 4,
) {
  const buffer = device.createBuffer({
    usage,
    size: align(data.byteLength, alignment),
    mappedAtCreation,
  });
  if (mappedAtCreation) {
    // @ts-ignore
    new data.constructor(buffer.getMappedRange()).set(data);
    buffer.unmap();
  }
  return buffer;
}
