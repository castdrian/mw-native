import { View } from "react-native";

import { BottomControls } from "./BottomControls";
import { Header } from "./Header";
import { MiddleControls } from "./MiddleControls";

export const ControlsOverlay = ({ isLoading }: { isLoading: boolean }) => {
  return (
    <View className="flex w-full flex-1 flex-col justify-between">
      <Header />
      {!isLoading && <MiddleControls />}
      <BottomControls />
    </View>
  );
};
