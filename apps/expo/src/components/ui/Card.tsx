import { Card, styled, withStaticProperties } from "tamagui";

export const MWCardFrame = styled(Card, {
  backgroundColor: "$shade600",
  borderColor: "$shade400",

  variants: {
    bordered: {
      true: {
        borderWidth: 1,
        borderColor: "$shade500",
      },
    },
  },
});

export const MWCard = withStaticProperties(MWCardFrame, {
  Header: Card.Header,
  Footer: Card.Footer,
  Background: Card.Background,
});
