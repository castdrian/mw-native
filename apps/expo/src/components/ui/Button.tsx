import { Button, styled } from "tamagui";

export const MWButton = styled(Button, {
  variants: {
    type: {
      primary: {
        backgroundColor: "$buttonPrimaryBackground",
        color: "$buttonPrimaryText",
        fontWeight: "bold",
        pressStyle: {
          backgroundColor: "$buttonPrimaryBackgroundHover",
        },
      },
      secondary: {
        backgroundColor: "$buttonSecondaryBackground",
        color: "$buttonSecondaryText",
        fontWeight: "bold",
        pressStyle: {
          backgroundColor: "$buttonSecondaryBackgroundHover",
        },
      },
      purple: {
        backgroundColor: "$buttonPurpleBackground",
        color: "white",
        fontWeight: "bold",
        pressStyle: {
          backgroundColor: "$buttonPurpleBackgroundHover",
        },
      },
      cancel: {
        backgroundColor: "$buttonCancelBackground",
        color: "white",
        fontWeight: "bold",
        pressStyle: {
          backgroundColor: "$buttonCancelBackgroundHover",
        },
      },
    },
  } as const,
});
