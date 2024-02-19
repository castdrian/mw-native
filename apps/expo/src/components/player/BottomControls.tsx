import { useState } from "react";
import { TouchableOpacity, View } from "react-native";

import { usePlayerStore } from "~/stores/player/store";
import { Text } from "../ui/Text";
import { CaptionsSelector } from "./CaptionsSelector";
import { Controls } from "./Controls";
import { ProgressBar } from "./ProgressBar";
import { SeasonSelector } from "./SeasonEpisodeSelector";
import { SourceSelector } from "./SourceSelector";
import { mapMillisecondsToTime } from "./utils";

export const BottomControls = () => {
  const status = usePlayerStore((state) => state.status);
  const setIsIdle = usePlayerStore((state) => state.setIsIdle);
  const [showRemaining, setShowRemaining] = useState(false);

  const toggleTimeDisplay = () => {
    setIsIdle(false);
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
      <View className="flex h-32 w-full flex-col items-center justify-center p-6">
        <Controls>
          <View className="flex w-full flex-row items-center">
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

          <ProgressBar />
        </Controls>
        <View className="flex w-full flex-row items-center justify-center gap-4 pb-10">
          <SeasonSelector />
          <CaptionsSelector />
          <SourceSelector />
        </View>
      </View>
    );
  }
};
