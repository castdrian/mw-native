import { View } from "tamagui";

import { BottomControls } from "./BottomControls";
import { Header } from "./Header";
import { MiddleControls } from "./MiddleControls";

export const ControlsOverlay = ({ isLoading }: { isLoading: boolean }) => {
  return (
    <View
      width="100%"
      flex={1}
      flexDirection="column"
      justifyContent="space-between"
    >
      <Header />
      {!isLoading && <MiddleControls />}
      <BottomControls />
    </View>
  );
};
