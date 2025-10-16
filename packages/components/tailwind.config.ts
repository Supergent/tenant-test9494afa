import type { Config } from "tailwindcss";
import { tailwindPreset } from "@jn7dkbdn845kr1g1tgfcjp0k2s7skmcg/design-tokens/tailwind.preset";

const config: Config = {
  darkMode: ["class"],
  presets: [tailwindPreset],
  content: ["./src/**/*.{{ts,tsx}}"],
  plugins: [],
};

export default config;
