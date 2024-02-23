import { useCallback, useMemo, useState } from "react";
import { TouchableOpacity, View } from "react-native";

import { usePlayerStore } from "~/stores/player/store";
import { Text } from "../ui/Text";
import { AudioTrackSelector } from "./AudioTrackSelector";
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

  const toggleTimeDisplay = useCallback(() => {
    setIsIdle(false);
    setShowRemaining(!showRemaining);
  }, [showRemaining, setIsIdle]);

  const { currentTime, remainingTime } = useMemo(() => {
    if (status?.isLoaded) {
      const current = mapMillisecondsToTime(status.positionMillis ?? 0);
      const remaining =
        "-" +
        mapMillisecondsToTime(
          (status.durationMillis ?? 0) - (status.positionMillis ?? 0),
        );
      return { currentTime: current, remainingTime: remaining };
    } else {
      return { currentTime: "", remainingTime: "" };
    }
  }, [status]);

  const durationTime = useMemo(() => {
    if (status?.isLoaded) {
      return mapMillisecondsToTime(status.durationMillis ?? 0);
    }
  }, [status]);

  if (status?.isLoaded) {
    return (
      <View className="flex h-32 w-full flex-col items-center justify-center p-6">
        <Controls>
          <View className="flex w-full flex-row items-center">
            <Text className="font-bold">{currentTime}</Text>
            <Text className="mx-1 font-bold">/</Text>
            <TouchableOpacity onPress={toggleTimeDisplay}>
              <Text className="font-bold">
                {showRemaining ? remainingTime : durationTime}
              </Text>
            </TouchableOpacity>
          </View>

          <ProgressBar />
        </Controls>
        <View className="flex w-full flex-row items-center justify-center gap-4 pb-10">
          <SeasonSelector />
          <CaptionsSelector />
          <SourceSelector />
          <AudioTrackSelector />
        </View>
      </View>
    );
  }
};
