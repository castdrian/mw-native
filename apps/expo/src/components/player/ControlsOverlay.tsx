import { View } from "react-native";

import { BottomControls } from "./BottomControls";
import { Header } from "./Header";
import { MiddleControls } from "./MiddleControls";

export const ControlsOverlay = () => {
  return (
    <View className="flex w-full flex-1 flex-col justify-between">
      <Header />
      <MiddleControls />
      <BottomControls />
    </View>
  );
};
