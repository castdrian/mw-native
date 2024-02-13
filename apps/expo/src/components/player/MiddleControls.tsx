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
      <View className="absolute inset-x-0 bottom-1/3 top-1/3 flex flex-row items-center justify-center gap-24">
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
