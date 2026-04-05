/**
 * Weyland-Yutani theme constants — FROZEN CONTRACT.
 * "Corporate Clinical" — warm off-white bg, light gray borders, gold CTAs.
 */
export const WY_THEME = {
  colors: {
    bg: '#F5F5F0',
    panelBg: '#FFFFFF',
    headerBg: '#1A1A1A',
    text: '#000000',
    textLight: '#FFFFFF',
    accent: '#D4A843',
    accentHover: '#C8A200',
    warning: '#CC0000',
    muted: '#7A7A75',
    border: '#D4D4D0',
    success: '#2D8A4E',
  },
  fonts: {
    primary: "'JetBrains Mono', monospace",
  },
  effects: {
    borderWidth: '1px',
    borderStyle: 'solid',
    borderRadius: '2px',
  },
} as const;
