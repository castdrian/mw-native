import { useEffect } from "react";
import { Pressable, ScrollView, View } from "react-native";
import Modal from "react-native-modal";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { defaultTheme } from "@movie-web/tailwind-config/themes";

import { useAudioTrack } from "~/hooks/player/useAudioTrack";
import { useBoolean } from "~/hooks/useBoolean";
import { useAudioTrackStore } from "~/stores/audio";
import { usePlayerStore } from "~/stores/player/store";
import { Button } from "../ui/Button";
import { Text } from "../ui/Text";
import { Controls } from "./Controls";

export interface AudioTrack {
  uri: string;
  name: string;
  language: string;
  active?: boolean;
}

export const AudioTrackSelector = () => {
  const tracks = usePlayerStore((state) => state.interface.audioTracks);
  const setAudioTracks = usePlayerStore((state) => state.setAudioTracks);
  const stream = usePlayerStore((state) => state.interface.currentStream);
  const selectedTrack = useAudioTrackStore((state) => state.selectedTrack);

  const setSelectedAudioTrack = useAudioTrackStore(
    (state) => state.setSelectedAudioTrack,
  );

  const { isTrue, on, off } = useBoolean();
  const { synchronizePlayback } = useAudioTrack();

  useEffect(() => {
    if (tracks && selectedTrack) {
      const needsUpdate = tracks.some(
        (t) => t.active !== (t.uri === selectedTrack.uri),
      );

      if (needsUpdate) {
        const updatedTracks = tracks.map((t) => ({
          ...t,
          active: t.uri === selectedTrack.uri,
        }));
        setAudioTracks(updatedTracks);
      }
    }
  }, [selectedTrack, setAudioTracks, tracks]);

  if (!tracks?.length) return null;

  return (
    <View className="max-w-36 flex-1">
      <Controls>
        <Button
          title="Audio"
          variant="outline"
          onPress={on}
          iconLeft={
            <MaterialCommunityIcons
              name="volume-high"
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
          <Text className="text-center font-bold">Select audio</Text>
          {tracks?.map((track) => (
            <Pressable
              className="flex w-full flex-row justify-between p-3"
              key={track.language}
              onPress={() => {
                setSelectedAudioTrack(track);
                if (stream) {
                  void synchronizePlayback(track, stream);
                }
                off();
              }}
            >
              <Text>{track.name}</Text>
              {track.active && (
                <MaterialCommunityIcons
                  name="check-circle"
                  size={24}
                  color={defaultTheme.extend.colors.buttons.purple}
                />
              )}
            </Pressable>
          ))}
        </ScrollView>
      </Modal>
    </View>
  );
};
