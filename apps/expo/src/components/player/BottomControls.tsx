import { useState } from "react";
import { TouchableOpacity, View } from "react-native";

import { usePlayerStore } from "~/stores/player/store";
import { Text } from "../ui/Text";
import { Controls } from "./Controls";
import { ProgressBar } from "./ProgressBar";
import { mapMillisecondsToTime } from "./utils";

export const BottomControls = () => {
  const status = usePlayerStore((state) => state.status);
  const [showRemaining, setShowRemaining] = useState(false);

  const toggleTimeDisplay = () => {
    setShowRemaining(!showRemaining);
  };

  const getTimeDisplay = () => {
    if (status?.isLoaded) {
      if (showRemaining) {
        const remainingTime =
          (status.durationMillis ?? 0) - (status.positionMillis ?? 0);
        return "-" + mapMillisecondsToTime(remainingTime);
      }
      return mapMillisecondsToTime(status.durationMillis ?? 0);
    }
  };

  if (status?.isLoaded) {
    return (
      <Controls>
        <View className="flex h-16 w-full flex-row items-center justify-center">
          <View className="flex flex-row items-center justify-center px-4 py-2">
            <Text className="font-bold">
              {mapMillisecondsToTime(status.positionMillis ?? 0)}
            </Text>
            <ProgressBar />
            <TouchableOpacity onPress={toggleTimeDisplay}>
              <Text className="font-bold">{getTimeDisplay()}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Controls>
    );
  }
};
