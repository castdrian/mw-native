import { TouchableWithoutFeedback, View } from "react-native";

import type { HeaderData } from "./Header";
import { usePlayerStore } from "~/stores/player/store";
import { BottomControls } from "./BottomControls";
import { Header } from "./Header";
import { MiddleControls } from "./MiddleControls";

interface ControlsOverlayProps {
  headerData: HeaderData;
}

export const ControlsOverlay = ({ headerData }: ControlsOverlayProps) => {
  const idle = usePlayerStore((state) => state.interface.isIdle);
  const setIsIdle = usePlayerStore((state) => state.setIsIdle);

  const handleTouch = () => {
    setIsIdle(!idle);
  };
  return (
    <View className="absolute left-0 top-0 flex h-full w-full flex-1">
      <Header data={headerData} />
      <TouchableWithoutFeedback onPress={handleTouch}>
        <MiddleControls />
      </TouchableWithoutFeedback>
      <BottomControls />
    </View>
  );
};
