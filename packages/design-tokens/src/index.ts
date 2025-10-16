/**
 * Design Tokens
 *
 * Central design system tokens generated from theme.json.
 * These tokens drive all styling across the application.
 */

export const theme = {
  name: "jn7dkbdn845kr1g1tgfcjp0k2s7skmcg-theme",
  tone: "neutral" as const,
  density: "balanced" as const,

  palette: {
    primary: {
      base: "#6366f1",
      foreground: "#ffffff",
      emphasis: "#4338ca",
    },
    secondary: {
      base: "#0ea5e9",
      foreground: "#0f172a",
      emphasis: "#0284c7",
    },
    accent: {
      base: "#f97316",
      foreground: "#0f172a",
      emphasis: "#ea580c",
    },
    success: {
      base: "#16a34a",
      foreground: "#022c22",
      emphasis: "#15803d",
    },
    warning: {
      base: "#facc15",
      foreground: "#422006",
      emphasis: "#eab308",
    },
    danger: {
      base: "#ef4444",
      foreground: "#450a0a",
      emphasis: "#dc2626",
    },
  },

  neutrals: {
    background: "#f8fafc",
    surface: "#ffffff",
    muted: "#e2e8f0",
    textPrimary: "#0f172a",
    textSecondary: "#475569",
  },

  radius: {
    sm: 4,
    md: 8,
    lg: 12,
    pill: 999,
  },

  spacing: {
    scale: {
      xs: 4,
      sm: 8,
      md: 12,
      lg: 20,
      xl: 28,
      "2xl": 40,
    },
    components: {
      paddingY: 12,
      paddingX: 20,
      gap: 16,
    },
  },

  typography: {
    fontFamily: "Inter, 'Inter Variable', system-ui, sans-serif",
    headingsFamily: "'Plus Jakarta Sans', 'Inter Variable', sans-serif",
    scale: {
      xs: 12,
      sm: 14,
      base: 16,
      lg: 18,
      xl: 22,
      "2xl": 28,
    },
    weight: {
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
  },

  shadows: {
    sm: "0 1px 2px 0 rgba(15, 23, 42, 0.08)",
    md: "0 10px 25px -15px rgba(15, 23, 42, 0.25)",
    lg: "0 18px 40px -20px rgba(15, 23, 42, 0.35)",
  },

  motion: {
    ease: "cubic-bezier(0.16, 1, 0.3, 1)",
    duration: {
      fast: 120,
      base: 200,
      slow: 320,
    },
  },
} as const;

/**
 * CSS Variables for use in stylesheets
 */
export const cssVariables = `
:root {
  /* Primary Colors */
  --color-primary: ${theme.palette.primary.base};
  --color-primary-foreground: ${theme.palette.primary.foreground};
  --color-primary-emphasis: ${theme.palette.primary.emphasis};

  /* Secondary Colors */
  --color-secondary: ${theme.palette.secondary.base};
  --color-secondary-foreground: ${theme.palette.secondary.foreground};
  --color-secondary-emphasis: ${theme.palette.secondary.emphasis};

  /* Accent Colors */
  --color-accent: ${theme.palette.accent.base};
  --color-accent-foreground: ${theme.palette.accent.foreground};
  --color-accent-emphasis: ${theme.palette.accent.emphasis};

  /* Success Colors */
  --color-success: ${theme.palette.success.base};
  --color-success-foreground: ${theme.palette.success.foreground};
  --color-success-emphasis: ${theme.palette.success.emphasis};

  /* Warning Colors */
  --color-warning: ${theme.palette.warning.base};
  --color-warning-foreground: ${theme.palette.warning.foreground};
  --color-warning-emphasis: ${theme.palette.warning.emphasis};

  /* Danger Colors */
  --color-danger: ${theme.palette.danger.base};
  --color-danger-foreground: ${theme.palette.danger.foreground};
  --color-danger-emphasis: ${theme.palette.danger.emphasis};

  /* Neutral Colors */
  --color-background: ${theme.neutrals.background};
  --color-surface: ${theme.neutrals.surface};
  --color-muted: ${theme.neutrals.muted};
  --color-text-primary: ${theme.neutrals.textPrimary};
  --color-text-secondary: ${theme.neutrals.textSecondary};

  /* Radius */
  --radius-sm: ${theme.radius.sm}px;
  --radius-md: ${theme.radius.md}px;
  --radius-lg: ${theme.radius.lg}px;
  --radius-pill: ${theme.radius.pill}px;

  /* Spacing */
  --spacing-xs: ${theme.spacing.scale.xs}px;
  --spacing-sm: ${theme.spacing.scale.sm}px;
  --spacing-md: ${theme.spacing.scale.md}px;
  --spacing-lg: ${theme.spacing.scale.lg}px;
  --spacing-xl: ${theme.spacing.scale.xl}px;
  --spacing-2xl: ${theme.spacing.scale["2xl"]}px;

  /* Typography */
  --font-family: ${theme.typography.fontFamily};
  --font-family-headings: ${theme.typography.headingsFamily};

  /* Shadows */
  --shadow-sm: ${theme.shadows.sm};
  --shadow-md: ${theme.shadows.md};
  --shadow-lg: ${theme.shadows.lg};

  /* Motion */
  --ease: ${theme.motion.ease};
  --duration-fast: ${theme.motion.duration.fast}ms;
  --duration-base: ${theme.motion.duration.base}ms;
  --duration-slow: ${theme.motion.duration.slow}ms;
}
`;

/**
 * Helper function to get CSS variable
 */
export function getCSSVar(name: string): string {
  return `var(--${name})`;
}

export type Theme = typeof theme;
