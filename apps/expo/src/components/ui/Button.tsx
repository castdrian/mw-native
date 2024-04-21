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
        disabledStyle: {
          backgroundColor: "$ash500",
          color: "$ash200",
          pointerEvents: "none",
        },
      },
      secondary: {
        backgroundColor: "$ash700",
        color: "$silver300",
        fontWeight: "bold",
        pressStyle: {
          backgroundColor: "$ash500",
        },
        disabledStyle: {
          backgroundColor: "$ash900",
          color: "$ash200",
          pointerEvents: "none",
        },
      },
      purple: {
        backgroundColor: "$purple500",
        color: "white",
        fontWeight: "bold",
        pressStyle: {
          backgroundColor: "$purple400",
        },
        disabledStyle: {
          backgroundColor: "$purple700",
          color: "$ash200",
          pointerEvents: "none",
        },
      },
      cancel: {
        backgroundColor: "$ash500",
        color: "white",
        fontWeight: "bold",
        pressStyle: {
          backgroundColor: "$ash300",
        },
        disabledStyle: {
          backgroundColor: "$ash700",
          color: "$ash200",
          pointerEvents: "none",
        },
      },
      danger: {
        backgroundColor: "$rose300",
        color: "white",
        fontWeight: "bold",
        pressStyle: {
          backgroundColor: "$rose200",
        },
        disabledStyle: {
          backgroundColor: "$rose500",
          color: "$ash200",
          pointerEvents: "none",
        },
      },
    },
  } as const,
});
