import { Progress, styled, withStaticProperties } from "tamagui";

const MWProgressFrame = styled(Progress, {
  backgroundColor: "$progressBackground",
});

const MWProgressIndicator = styled(Progress.Indicator, {
  backgroundColor: "$progressFilled",
  animation: "bounce",
});

export const MWProgress = withStaticProperties(MWProgressFrame, {
  Indicator: MWProgressIndicator,
});
