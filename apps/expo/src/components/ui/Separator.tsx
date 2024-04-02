import { Separator, styled } from "tamagui";

export const MWSeparator = styled(Separator, {
  variants: {
    type: {
      settings: {
        borderColor: "$shade300",
      },
    },
  },
  defaultVariants: {
    type: "settings",
  },
});
