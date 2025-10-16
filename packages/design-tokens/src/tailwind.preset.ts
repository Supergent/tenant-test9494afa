/**
 * Tailwind CSS Preset
 *
 * Shared Tailwind configuration based on design tokens.
 * Import this preset in app-level tailwind.config files.
 */

import type { Config } from "tailwindcss";
import { theme } from "./index";

const preset: Partial<Config> = {
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: theme.palette.primary.base,
          foreground: theme.palette.primary.foreground,
          emphasis: theme.palette.primary.emphasis,
        },
        secondary: {
          DEFAULT: theme.palette.secondary.base,
          foreground: theme.palette.secondary.foreground,
          emphasis: theme.palette.secondary.emphasis,
        },
        accent: {
          DEFAULT: theme.palette.accent.base,
          foreground: theme.palette.accent.foreground,
          emphasis: theme.palette.accent.emphasis,
        },
        success: {
          DEFAULT: theme.palette.success.base,
          foreground: theme.palette.success.foreground,
          emphasis: theme.palette.success.emphasis,
        },
        warning: {
          DEFAULT: theme.palette.warning.base,
          foreground: theme.palette.warning.foreground,
          emphasis: theme.palette.warning.emphasis,
        },
        danger: {
          DEFAULT: theme.palette.danger.base,
          foreground: theme.palette.danger.foreground,
          emphasis: theme.palette.danger.emphasis,
        },
        background: theme.neutrals.background,
        surface: theme.neutrals.surface,
        muted: theme.neutrals.muted,
        "text-primary": theme.neutrals.textPrimary,
        "text-secondary": theme.neutrals.textSecondary,
      },
      borderRadius: {
        sm: `${theme.radius.sm}px`,
        md: `${theme.radius.md}px`,
        lg: `${theme.radius.lg}px`,
        pill: `${theme.radius.pill}px`,
      },
      spacing: {
        xs: `${theme.spacing.scale.xs}px`,
        sm: `${theme.spacing.scale.sm}px`,
        md: `${theme.spacing.scale.md}px`,
        lg: `${theme.spacing.scale.lg}px`,
        xl: `${theme.spacing.scale.xl}px`,
        "2xl": `${theme.spacing.scale["2xl"]}px`,
      },
      fontFamily: {
        sans: theme.typography.fontFamily.split(", "),
        headings: theme.typography.headingsFamily.split(", "),
      },
      fontSize: {
        xs: [`${theme.typography.scale.xs}px`, { lineHeight: "1.5" }],
        sm: [`${theme.typography.scale.sm}px`, { lineHeight: "1.5" }],
        base: [`${theme.typography.scale.base}px`, { lineHeight: "1.5" }],
        lg: [`${theme.typography.scale.lg}px`, { lineHeight: "1.5" }],
        xl: [`${theme.typography.scale.xl}px`, { lineHeight: "1.4" }],
        "2xl": [`${theme.typography.scale["2xl"]}px`, { lineHeight: "1.3" }],
      },
      fontWeight: {
        regular: `${theme.typography.weight.regular}`,
        medium: `${theme.typography.weight.medium}`,
        semibold: `${theme.typography.weight.semibold}`,
        bold: `${theme.typography.weight.bold}`,
      },
      boxShadow: {
        sm: theme.shadows.sm,
        md: theme.shadows.md,
        lg: theme.shadows.lg,
      },
      transitionTimingFunction: {
        DEFAULT: theme.motion.ease,
      },
      transitionDuration: {
        fast: `${theme.motion.duration.fast}ms`,
        DEFAULT: `${theme.motion.duration.base}ms`,
        slow: `${theme.motion.duration.slow}ms`,
      },
    },
  },
};

export default preset;
