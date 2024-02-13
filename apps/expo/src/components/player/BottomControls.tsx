import { View } from "react-native";

import { usePlayerStore } from "~/stores/player/store";
import { Text } from "../ui/Text";
import { Controls } from "./Controls";
import { ProgressBar } from "./ProgressBar";
import { mapMillisecondsToTime } from "./utils";

export const BottomControls = () => {
  const status = usePlayerStore((state) => state.status);
  status?.isLoaded;

  if (status?.isLoaded) {
    return (
      <Controls>
        <View className="flex h-16 w-full flex-row items-center justify-center">
          <View className="flex flex-row items-center justify-center gap-5 px-4 py-2">
            <Text className="font-bold">
              {mapMillisecondsToTime(status.positionMillis ?? 0)}
            </Text>
            <ProgressBar />
            <Text className="font-bold">
              {mapMillisecondsToTime(status.durationMillis ?? 0)}
            </Text>
          </View>
        </View>
      </Controls>
    );
  }
};
