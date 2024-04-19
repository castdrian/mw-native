import { Button, styled } from "tamagui";

export const MWButton = styled(Button, {
  variants: {
    type: {
      primary: {
        backgroundColor: "white",
        color: "black",
        fontWeight: "bold",
        pressStyle: {
          backgroundColor: "$silver100",
        },
      },
      secondary: {
        backgroundColor: "$ash700",
        color: "$silver300",
        fontWeight: "bold",
        pressStyle: {
          backgroundColor: "$ash500",
        },
      },
      purple: {
        backgroundColor: "$purple500",
        color: "white",
        fontWeight: "bold",
        pressStyle: {
          backgroundColor: "$purple400",
        },
      },
      cancel: {
        backgroundColor: "$ash500",
        color: "white",
        fontWeight: "bold",
        pressStyle: {
          backgroundColor: "$ash300",
        },
      },
    },
  } as const,
});
