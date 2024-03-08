import { Pressable, ScrollView, View } from "react-native";
import Modal from "react-native-modal";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { defaultTheme } from "@movie-web/tailwind-config/themes";

import { usePlaybackSpeed } from "~/hooks/player/usePlaybackSpeed";
import { useBoolean } from "~/hooks/useBoolean";
import { Button } from "../ui/Button";
import { Text } from "../ui/Text";
import { Controls } from "./Controls";

export const PlaybackSpeedSelector = () => {
  const { currentSpeed, changePlaybackSpeed } = usePlaybackSpeed();
  const { isTrue, on, off } = useBoolean();

  const speeds = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];

  return (
    <View className="max-w-36 flex-1">
      <Controls>
        <Button
          title="Speed"
          variant="outline"
          onPress={on}
          iconLeft={
            <MaterialCommunityIcons
              name="speedometer"
              size={24}
              color={defaultTheme.extend.colors.buttons.primary}
            />
          }
        />
      </Controls>

      <Modal
        isVisible={isTrue}
        onBackdropPress={off}
        supportedOrientations={["portrait", "landscape"]}
        style={{
          width: "35%",
          justifyContent: "center",
          alignSelf: "center",
        }}
      >
        <ScrollView className="flex-1 bg-gray-900">
          <Text className="text-center font-bold">Select speed</Text>
          {speeds.map((speed) => (
            <Pressable
              className="flex w-full flex-row justify-between p-3"
              key={speed}
              onPress={() => {
                changePlaybackSpeed(speed);
                off();
              }}
            >
              <Text>{speed}</Text>
              {speed === currentSpeed && (
                <MaterialCommunityIcons
                  name="check-circle"
                  size={24}
                  color={defaultTheme.extend.colors.buttons.primary}
                />
              )}
            </Pressable>
          ))}
        </ScrollView>
      </Modal>
    </View>
  );
};
