import { useMemo } from 'react';
import resolveConfig from 'tailwindcss/resolveConfig';

import tailwindConfig from '../../tailwind.config';

const useTailwind = () => {
  const tailwind = useMemo(() => resolveConfig(tailwindConfig), []);
  console.log(tailwind);
  return {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    colors: tailwind.theme.colors as typeof tailwindConfig.theme.extend.colors,
  };
};

export default useTailwind;
