import { Input, styled } from "tamagui";

export const MWInput = styled(Input, {
  fontWeight: "$semibold",

  variants: {
    type: {
      default: {
        backgroundColor: "$ash600",
        color: "$ash100",
        placeholderTextColor: "$ash200",
        borderColor: "$ash500",
        outlineStyle: "none",
        focusStyle: {
          borderColor: "$ash300",
        },
      },
      search: {
        backgroundColor: "$shade500",
        color: "$shade100",
        borderColor: "$colorTransparent",
        placeholderTextColor: "$shade100",
        outlineStyle: "none",
        focusStyle: {
          borderColor: "$colorTransparent",
        },
      },
      authentication: {
        backgroundColor: "$shade500",
        color: "$shade100",
        placeholderTextColor: "$shade400",
        outlineStyle: "none",
        focusStyle: {
          borderColor: "$shade300",
        },
        pressStyle: {
          backgroundColor: "$shade500",
        },
      },
    },
  },
});
