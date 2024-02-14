import { StyleSheet, View } from "react-native";

import { Controls } from "./Controls";
import { PlayButton } from "./PlayButton";
import { SeekButton } from "./SeekButton";

export const MiddleControls = () => {
  return (
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
