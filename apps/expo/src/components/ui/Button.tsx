import type { VariantProps } from "class-variance-authority";
import type { ReactNode } from "react";
import type { PressableProps } from "react-native";
import { Pressable } from "react-native";
import { cva } from "class-variance-authority";

import { cn } from "~/lib/utils";
import { Text } from "./Text";

const buttonVariants = cva(
  "flex flex-row items-center justify-center gap-4 rounded-md disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary-300",
        outline: "border border-primary-400 bg-transparent",
        secondary: "bg-secondary-300",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends PressableProps,
    VariantProps<typeof buttonVariants> {
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  title: string;
}

export function Button({
  onPress,
  variant,
  size,
  className,
  iconLeft,
  iconRight,
  title,
}: ButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      className={cn(buttonVariants({ variant, size, className }))}
    >
      {iconLeft}
      <Text className="font-bold">{title}</Text>
      {iconRight}
    </Pressable>
  );
}
