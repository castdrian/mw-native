import type { ContentCaption } from "subsrt-ts/dist/types/handler";
import { useCallback } from "react";
import { Pressable, ScrollView, View } from "react-native";
import Modal from "react-native-modal";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { parse } from "subsrt-ts";

import type { Stream } from "@movie-web/provider-utils";
import { defaultTheme } from "@movie-web/tailwind-config/themes";

import { useBoolean } from "~/hooks/useBoolean";
import { useCaptionsStore } from "~/stores/captions";
import { usePlayerStore } from "~/stores/player/store";
import { Button } from "../ui/Button";
import { Text } from "../ui/Text";
import { Controls } from "./Controls";
import { getPrettyLanguageNameFromLocale } from "./utils";

const parseCaption = async (
  caption: Stream["captions"][0],
): Promise<ContentCaption[]> => {
  const response = await fetch(caption.url);
  const data = await response.text();
  return parse(data).filter(
    (cue) => cue.type === "caption",
  ) as ContentCaption[];
};

export const CaptionsSelector = () => {
  const captions = usePlayerStore(
    (state) => state.interface.currentStream?.captions,
  );
  const setSelectedCaption = useCaptionsStore(
    (state) => state.setSelectedCaption,
  );
  const { isTrue, on, off } = useBoolean();

  const downloadAndSetCaption = useCallback(
    (caption: Stream["captions"][0]) => {
      parseCaption(caption)
        .then((data) => {
          setSelectedCaption({ ...caption, data });
        })
        .catch(console.error);
    },
    [setSelectedCaption],
  );

  if (!captions?.length) return null;

  return (
    <View className="max-w-36 flex-1">
      <Controls>
        <Button
          title="Subtitles"
          variant="outline"
          onPress={on}
          iconLeft={
            <MaterialCommunityIcons
              name="subtitles"
              size={24}
              color={defaultTheme.extend.colors.buttons.purple}
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
          <Text className="text-center font-bold">Select subtitle</Text>
          {captions?.map((caption) => (
            <Pressable
              className="flex w-full flex-row justify-between p-3"
              key={caption.id}
              onPress={() => {
                downloadAndSetCaption(caption);
                off();
              }}
            >
              <Text>{getPrettyLanguageNameFromLocale(caption.language)}</Text>
              <MaterialCommunityIcons
                name="download"
                size={24}
                color={defaultTheme.extend.colors.buttons.purple}
              />
            </Pressable>
          ))}
        </ScrollView>
      </Modal>
    </View>
  );
};
