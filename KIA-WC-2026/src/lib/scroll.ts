export const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v))

export const remap = (v: number, inMin: number, inMax: number, outMin: number, outMax: number) =>
  clamp((v - inMin) / (inMax - inMin), 0, 1) * (outMax - outMin) + outMin
