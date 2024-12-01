export const Theme = {
  light: 'light',
  dark: 'dark',
};

export type Theme = typeof Theme[keyof typeof Theme];
