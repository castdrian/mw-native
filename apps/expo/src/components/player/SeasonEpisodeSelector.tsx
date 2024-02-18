import { ScrollView, View } from "react-native";
import Modal from "react-native-modal";
import { useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import colors from "@movie-web/tailwind-config/colors";

import { useBoolean } from "~/hooks/useBoolean";
import { usePlayerStore } from "~/stores/player/store";
import { Button } from "../ui/Button";
import { Text } from "../ui/Text";

export const SeasonEpisodeSelector = () => {
  const data = usePlayerStore((state) => state.interface.data);
  const seasonData = usePlayerStore((state) => state.interface.seasonData);
  const { isTrue, on, off } = useBoolean();
  const _router = useRouter();

  return data?.type === "movie" || !seasonData ? null : (
    <View className="max-w-36 flex-1">
      <Button
        title="Episode"
        variant="outline"
        onPress={on}
        iconLeft={
          <MaterialCommunityIcons
            name="audio-video"
            size={24}
            color={colors.primary[300]}
          />
        }
      />

      <Modal
        isVisible={isTrue}
        onBackdropPress={off}
        supportedOrientations={["portrait", "landscape"]}
      >
        <ScrollView className="flex-1 bg-gray-900">
          <Text className="text-center font-bold">Select episode</Text>
          {seasonData.episodes.map((episode) => (
            <Button
              key={episode.id}
              title={episode.name}
              onPress={() => {
                off();
                // router.push({
                //   pathname: "/videoPlayer/loading",
                //   params: { sourceID: source.id, data: JSON.stringify(data) },
                // });
              }}
              className="max-w-16"
            />
          ))}
        </ScrollView>
      </Modal>
    </View>
  );
};
