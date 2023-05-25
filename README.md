# wgsl-struct-buffer

一个给`WGSL's Struct`提供`BufferView`的小工具

# 使用

```sh
> pnpm i -S wgsl-struct-buffer
```

```ts
import { wgsl } from 'wgsl-struct-buffer';

const { view, buffer, struct } = new wgsl.StructBuffer({
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
view.ambient.set([0, 0, 0]);
view.lightCount = 4;
view.lights.forEach(light => {
  light.position.set([1, 2, 3]);
  light.color.set([1, 1, 1]);
  light.range = 10;
  light.intensity = 0.8;
});
console.log(buffer);
console.log(wgsl.stringifyStruct('LightInfo', struct));
/** output
struct LightInfo_lights {
  position: vec3f,
  range: f32,
  color: vec3f,
  intensity: f32,
};
struct LightInfo {
  ambient: vec3f,
  lightCount: u32,
  lights: array<LightInfo_lights, 4>,
};
*/
```

# 赞助

如果项目对您有帮助，欢迎打赏

<img src="https://upload-images.jianshu.io/upload_images/252050-d3d6bfdb1bb06ddd.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240" alt="赞赏码" width="300">

感谢各位支持~~

# License

MIT 仅供学习交流使用
