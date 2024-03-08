import { useCallback, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, View } from "react-native";
import Modal from "react-native-modal";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

import { getBuiltinSources, providers } from "@movie-web/provider-utils";
import { defaultTheme } from "@movie-web/tailwind-config/themes";

import {
  useEmbedScrape,
  useSourceScrape,
} from "~/hooks/player/useSourceScrape";
import { useBoolean } from "~/hooks/useBoolean";
import { usePlayerStore } from "~/stores/player/store";
import { Button } from "../ui/Button";
import { Text } from "../ui/Text";
import { Controls } from "./Controls";

const SourceItem = ({
  name,
  id,
  active,
  embed,
  onPress,
  closeModal,
}: {
  name: string;
  id: string;
  active?: boolean;
  embed?: { url: string; embedId: string };
  onPress?: (id: string) => void;
  closeModal?: () => void;
}) => {
  const { mutate, isPending, isError } = useEmbedScrape(closeModal);

  return (
    <Pressable
      className="flex w-full flex-row justify-between p-3"
      onPress={() => {
        if (onPress) {
          onPress(id);
          return;
        }
        if (embed) {
          mutate({
            url: embed.url,
            embedId: embed.embedId,
            sourceId: id,
          });
        }
      }}
    >
      <Text className="font-bold">{name}</Text>
      {active && (
        <MaterialCommunityIcons
          name="check-circle"
          size={24}
          color={defaultTheme.extend.colors.buttons.primary}
        />
      )}
      {isError && (
        <MaterialCommunityIcons
          name="alert-circle"
          size={24}
          color={defaultTheme.extend.colors.video.context.error}
        />
      )}
      {isPending && <ActivityIndicator size="small" color="#0000ff" />}
    </Pressable>
  );
};

const EmbedsPart = ({
  sourceId,
  setCurrentScreen,
  closeModal,
}: {
  sourceId: string;
  setCurrentScreen: (screen: "source" | "embed") => void;
  closeModal: () => void;
}) => {
  const { data, isPending, error } = useSourceScrape(sourceId, closeModal);

  return (
    <View className="flex w-full flex-col gap-4 p-3">
      <View className="flex-row items-center gap-4">
        <Ionicons
          name="arrow-back"
          size={30}
          color="white"
          onPress={() => setCurrentScreen("source")}
        />
        <Text className="text-xl font-bold">Embeds</Text>
      </View>
      {isPending && <ActivityIndicator size="small" color="#0000ff" />}
      {error && <Text>{error.message}</Text>}
      {data && data?.length > 1 && (
        <View className="flex w-full flex-col p-3">
          {data.map((embed) => {
            const metaData = providers.getMetadata(embed.embedId)!;
            return (
              <SourceItem
                key={embed.embedId}
                name={metaData.name}
                id={embed.embedId}
                embed={embed}
                closeModal={closeModal}
              />
            );
          })}
        </View>
      )}
    </View>
  );
};

export const SourceSelector = () => {
  const [currentScreen, setCurrentScreen] = useState<"source" | "embed">(
    "source",
  );
  const sourceId = usePlayerStore((state) => state.interface.sourceId);
  const setSourceId = usePlayerStore((state) => state.setSourceId);

  const { isTrue, on, off } = useBoolean();

  const isActive = useCallback(
    (id: string) => {
      return sourceId === id;
    },
    [sourceId],
  );

  return (
    <View className="max-w-36">
      <Controls>
        <Button
          title="Source"
          variant="outline"
          onPress={on}
          iconLeft={
            <MaterialCommunityIcons
              name="video"
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
        <ScrollView
          className="w-full flex-1 bg-gray-900"
          contentContainerStyle={{
            padding: 10,
          }}
        >
          {currentScreen === "source" && (
            <>
              {getBuiltinSources()
                .sort((a, b) => b.rank - a.rank)
                .map((source) => (
                  <SourceItem
                    key={source.id}
                    name={source.name}
                    id={source.id}
                    active={isActive(source.id)}
                    onPress={() => {
                      setSourceId(source.id);
                      setCurrentScreen("embed");
                    }}
                  />
                ))}
            </>
          )}
          {currentScreen === "embed" && (
            <EmbedsPart
              sourceId={sourceId!}
              setCurrentScreen={setCurrentScreen}
              closeModal={off}
            />
          )}
        </ScrollView>
      </Modal>
    </View>
  );
};
