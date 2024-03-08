import type { defaultTheme } from "./default";

type DeepPartial<T> = {
  [P in keyof T]?: DeepPartial<T[P]>;
};

export interface Theme {
  name: string;
  extend: DeepPartial<(typeof defaultTheme)["extend"]>;
}

export function createTheme(theme: Theme) {
  return {
    name: theme.name,
    selectors: [`.theme-${theme.name}`],
    extend: theme.extend,
  };
}
