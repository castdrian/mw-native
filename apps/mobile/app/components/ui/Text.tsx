import { TextProps, Text as RNText } from 'react-native';
import { cn } from '../../lib/utils';
import { cva } from 'class-variance-authority';

const textVariants = cva('font-sans text-white');

export const Text = ({ className, ...props }: TextProps) => {
  return <RNText className={cn(textVariants(), className)} {...props} />;
};
