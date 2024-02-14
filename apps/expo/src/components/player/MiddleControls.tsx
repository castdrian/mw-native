import { StyleSheet, TouchableWithoutFeedback, View } from "react-native";

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
      <View style={styles.container}>
        <Controls className="mr-24">
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 82,
  },
});
