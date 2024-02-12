import { View } from "react-native";

import { Controls } from "./Controls";
import { PlayButton } from "./PlayButton";
import { SeekButton } from "./SeekButton";

export const MiddleControls = () => {
  return (
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
  );
};
