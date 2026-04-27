"use client";

import dynamic from "next/dynamic";

const NeuroNoise = dynamic(
  () => import("@paper-design/shaders-react").then(m => ({ default: m.NeuroNoise })),
  { ssr: false, loading: () => null }
);

export function HeroShader() {
  return (
    <NeuroNoise
      colorBack="#020c14"
      colorMid="#003355"
      colorFront="#0ea5e9"
      brightness={0.07}
      contrast={0.28}
      speed={0.3}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", zIndex: 0 }}
    />
  );
}
