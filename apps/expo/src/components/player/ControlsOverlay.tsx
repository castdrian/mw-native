import { View } from "react-native";

import type { HeaderData } from "./Header";
import { BottomControls } from "./BottomControls";
import { Header } from "./Header";
import { MiddleControls } from "./MiddleControls";

interface ControlsOverlayProps {
  headerData: HeaderData;
}

export const ControlsOverlay = ({ headerData }: ControlsOverlayProps) => {
  return (
    <View className="absolute left-0 top-0 flex h-full w-full flex-1">
      <Header data={headerData} />
      <MiddleControls />
      <BottomControls />
    </View>
  );
};
