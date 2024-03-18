/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { ButtonProps } from "tamagui";
import React from "react";
import { Button, styled } from "tamagui";

const PrimaryButton = styled(Button, {
  backgroundColor: "$buttonPrimaryBackground",
  color: "$buttonPrimaryText",
  fontWeight: "bold",
});

const SecondaryButton = styled(Button, {
  backgroundColor: "$buttonSecondaryBackground",
  color: "$buttonSecondaryText",
  fontWeight: "bold",
});

const PurpleButton = styled(Button, {
  backgroundColor: "$buttonPurpleBackground",
  color: "white",
  fontWeight: "bold",
});

const CancelButton = styled(Button, {
  backgroundColor: "$buttonCancelBackground",
  color: "white",
  fontWeight: "bold",
});

export const MWButton = React.forwardRef<
  typeof Button,
  ButtonProps & {
    type?: "primary" | "secondary" | "purple" | "cancel";
  }
>((props, ref) => {
  const { type, ...rest } = props;
  switch (type) {
    case "primary":
      return <PrimaryButton {...rest} ref={ref as any} />;
    case "secondary":
      return <SecondaryButton {...rest} ref={ref as any} />;
    case "purple":
      return <PurpleButton {...rest} ref={ref as any} />;
    case "cancel":
      return <CancelButton {...rest} ref={ref as any} />;
    default:
      return <Button {...rest} ref={ref as any} />;
  }
});

MWButton.displayName = "MWButton";
