import type { TextProps } from "react-native";
import { Text as RNText } from "react-native";
import { cva } from "class-variance-authority";

import { cn } from "~/app/lib/utils";

const textVariants = cva("text-white");

export function Text({ className, ...props }: TextProps) {
  return (
    <RNText
      className={cn(className, textVariants(), {
        "font-sans": !className?.includes("font-"),
      })}
      {...props}
    />
  );
}
