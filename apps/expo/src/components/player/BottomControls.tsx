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

  const getCurrentTime = () => {
    if (status?.isLoaded) {
      return mapMillisecondsToTime(status.positionMillis ?? 0);
    }
  };

  const getRemainingTime = () => {
    if (status?.isLoaded) {
      const remainingTime =
        (status.durationMillis ?? 0) - (status.positionMillis ?? 0);
      return "-" + mapMillisecondsToTime(remainingTime);
    }
  };

  if (status?.isLoaded) {
    return (
      <Controls>
        <View className="flex h-16 w-full flex-col items-center justify-center">
          <View className="w-full px-4">
            <View className="flex flex-row items-center">
              <Text className="font-bold">{getCurrentTime()}</Text>
              <Text className="mx-1 font-bold">/</Text>
              <TouchableOpacity onPress={toggleTimeDisplay}>
                <Text className="font-bold">
                  {showRemaining
                    ? getRemainingTime()
                    : mapMillisecondsToTime(status.durationMillis ?? 0)}
                </Text>
              </TouchableOpacity>
            </View>

            <View className="py-2">
              <ProgressBar />
            </View>
          </View>
        </View>
      </Controls>
    );
  }
};
