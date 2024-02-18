import { ScrollView, View } from "react-native";
import Modal from "react-native-modal";
import { useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { getBuiltinSources } from "@movie-web/provider-utils";
import colors from "@movie-web/tailwind-config/colors";

import { useBoolean } from "~/hooks/useBoolean";
import { usePlayerStore } from "~/stores/player/store";
import { Button } from "../ui/Button";
import { Text } from "../ui/Text";

export const SourceSelector = () => {
  const data = usePlayerStore((state) => state.interface.data);
  const { isTrue, on, off } = useBoolean();
  const router = useRouter();

  return (
    <View className="max-w-36 flex-1">
      <Button
        title="Source"
        variant="outline"
        onPress={on}
        iconLeft={
          <MaterialCommunityIcons
            name="video"
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
          <Text className="text-center font-bold">Select source</Text>
          {getBuiltinSources().map((source) => (
            <Button
              key={source.id}
              title={source.name}
              onPress={() => {
                off();
                router.push({
                  pathname: "/videoPlayer/loading",
                  params: { sourceID: source.id, data: JSON.stringify(data) },
                });
              }}
              className="max-w-16"
            />
          ))}
        </ScrollView>
      </Modal>
    </View>
  );
};
