struct Subarray {
  f32_: f32,
  i32_: i32,
}
struct Substruct {
  vec2_0: vec2<f32>,
  vec2_1: vec2<f32>,
  subarray: array<Subarray, 2>,
}

struct Test {
  u32_: u32,
  i32_: i32,
  f32_: f32,
  vec2_: vec2<f32>,
  vec3_: vec3<f32>,
  vec4_: vec4<f32>,
  mat3_: mat3x3<f32>,
  mat4_: mat4x4<f32>,
  substruct: Substruct,
  subarray: array<Substruct, 2>,
}

@group(0) @binding(0) var<storage, read_write> view: Test;

@compute @workgroup_size(1)
fn main(@builtin(global_invocation_id) id: vec3<u32>) {
  view.u32_ = 1u;
  view.i32_ = 2;
  view.f32_ = 3.0;
  view.vec2_ = vec2<f32>(4.0, 5.0);
  view.vec3_ = vec3<f32>(6.0, 7.0, 8.0);
  view.vec4_ = vec4<f32>(9.0, 10.0, 11.0, 12.0);
  view.mat3_ = mat3x3<f32>(
    13.0, 14.0, 15.0, 
    16.0, 17.0, 18.0,
    19.0, 20.0, 21.0,
  );
  view.mat4_ = mat4x4<f32>(
    22.0, 23.0, 24.0, 25.0, 
    26.0, 27.0, 28.0, 29.0,
    30.0, 31.0, 32.0, 33.0,
    34.0, 35.0, 36.0, 37.0,
  );
  view.substruct.vec2_0 = vec2<f32>(38.0, 39.0);
  view.substruct.vec2_1 = vec2<f32>(40.0, 41.0);
  view.substruct.subarray[0].f32_ = 42.0;
  view.substruct.subarray[0].i32_ = 43;
  view.substruct.subarray[1].f32_ = 44.0;
  view.substruct.subarray[1].i32_ = 45;

  view.subarray[0].vec2_0 = vec2<f32>(46.0, 47.0);
  view.subarray[0].vec2_1 = vec2<f32>(48.0, 49.0);
  view.subarray[0].subarray[0].f32_ = 50.0;
  view.subarray[0].subarray[0].i32_ = 51;
  view.subarray[0].subarray[1].f32_ = 52.0;
  view.subarray[0].subarray[1].i32_ = 53;

  view.subarray[1].vec2_0 = vec2<f32>(54.0, 55.0);
  view.subarray[1].vec2_1 = vec2<f32>(56.0, 57.0);
  view.subarray[1].subarray[0].f32_ = 58.0;
  view.subarray[1].subarray[0].i32_ = 59;
  view.subarray[1].subarray[1].f32_ = 60.0;
  view.subarray[1].subarray[1].i32_ = 61;
}