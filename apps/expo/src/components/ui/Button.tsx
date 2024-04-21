import { Button, Spinner, styled, withStaticProperties } from "tamagui";

const MWButtonFrame = styled(Button, {
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

const ButtonComponent = MWButtonFrame.styleable<{
  isLoading?: boolean;
}>(function Button(props, ref) {
  const spinnerColor =
    // @ts-expect-error this is a hack to get the color from the variant
    MWButtonFrame.staticConfig.variants?.type?.[props.type!]?.color as string;
  return (
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    <MWButtonFrame {...props} ref={ref}>
      {props.isLoading && (
        <Spinner size="small" color={spinnerColor ?? "white"} />
      )}
      {props.children}
    </MWButtonFrame>
  );
});

export const MWButton = withStaticProperties(ButtonComponent, {});
