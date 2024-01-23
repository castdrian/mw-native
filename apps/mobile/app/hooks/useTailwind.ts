import { useMemo } from 'react';
import resolveConfig from 'tailwindcss/resolveConfig';

import tailwindConfig from '../../tailwind.config.js';

const useTailwind = () => {
  const tailwind = useMemo(() => resolveConfig(tailwindConfig), []);
  return {
    colors: tailwind.theme.colors,
  };
};

export default useTailwind;
