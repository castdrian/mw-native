import { TouchableWithoutFeedback, View } from "react-native";

import { usePlayerStore } from "~/stores/player/store";
import { Controls } from "./Controls";
import { PlayButton } from "./PlayButton";
import { SeekButton } from "./SeekButton";

export const MiddleControls = () => {
  const idle = usePlayerStore((state) => state.interface.isIdle);
  const setIsIdle = usePlayerStore((state) => state.setIsIdle);

  const handleTouch = () => {
    setIsIdle(!idle);
  };

  return (
    <TouchableWithoutFeedback onPress={handleTouch}>
      <View className="absolute flex h-full w-full flex-1 flex-row items-center justify-center gap-24">
        <Controls>
          <SeekButton type="backward" />
        </Controls>
        <Controls>
          <PlayButton />
        </Controls>
        <Controls>
          <SeekButton type="forward" />
        </Controls>
      </View>
    </TouchableWithoutFeedback>
  );
};
