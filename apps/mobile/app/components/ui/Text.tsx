import { cva } from 'class-variance-authority';
import { Text as RNText, TextProps } from 'react-native';

import { cn } from '../../lib/utils';

const textVariants = cva('text-white');

export function Text({ className, ...props }: TextProps) {
  return (
    <RNText
      className={cn(className, textVariants(), {
        'font-sans': !className?.includes('font-'),
      })}
      {...props}
    />
  );
}
