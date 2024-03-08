import { useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import Modal from "react-native-modal";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";

import { defaultTheme } from "@movie-web/tailwind-config/themes";
import { fetchMediaDetails, fetchSeasonDetails } from "@movie-web/tmdb";

import { useBoolean } from "~/hooks/useBoolean";
import { usePlayerStore } from "~/stores/player/store";
import { Button } from "../ui/Button";
import { Divider } from "../ui/Divider";
import { Text } from "../ui/Text";
import { Controls } from "./Controls";

const EpisodeSelector = ({
  seasonNumber,
  setSelectedSeason,
  closeModal,
}: {
  seasonNumber: number;
  setSelectedSeason: (season: number | null) => void;
  closeModal: () => void;
}) => {
  const meta = usePlayerStore((state) => state.meta);
  const setMeta = usePlayerStore((state) => state.setMeta);

  const { data, isLoading } = useQuery({
    queryKey: ["seasonEpisodes", meta!.tmdbId, seasonNumber],
    queryFn: async () => {
      return fetchSeasonDetails(meta!.tmdbId, seasonNumber);
    },
    enabled: meta !== null,
  });

  if (!meta) return null;

  return (
    <>
      {isLoading && (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator
            size="large"
            color={defaultTheme.extend.colors.buttons.purple}
          />
        </View>
      )}
      {data && (
        <ScrollView
          className="flex-1 flex-col bg-gray-900"
          contentContainerStyle={{
            padding: 10,
          }}
        >
          <View className="flex-row items-center gap-4 p-2">
            <Ionicons
              name="arrow-back"
              size={20}
              color="white"
              onPress={() => setSelectedSeason(null)}
            />
            <Text className="text-center font-bold">
              Season {data.season_number}
            </Text>
          </View>
          <Divider />
          {data.episodes.map((episode) => (
            <TouchableOpacity
              key={episode.id}
              className="p-3"
              onPress={() => {
                setMeta({
                  ...meta,
                  episode: {
                    number: episode.episode_number,
                    tmdbId: episode.id.toString(),
                  },
                });
                closeModal();
              }}
            >
              <Text>
                E{episode.episode_number} {episode.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </>
  );
};

export const SeasonSelector = () => {
  const [selectedSeason, setSelectedSeason] = useState<number | null>(null);
  const meta = usePlayerStore((state) => state.meta);

  const { isTrue, on, off } = useBoolean();

  const { data, isLoading } = useQuery({
    queryKey: ["seasons", meta!.tmdbId],
    queryFn: async () => {
      return fetchMediaDetails(meta!.tmdbId, "tv");
    },
    enabled: meta !== null,
  });

  if (meta?.type !== "show") return null;

  return (
    <View className="max-w-36 flex-1">
      <Controls>
        <Button
          title="Episode"
          variant="outline"
          onPress={on}
          iconLeft={
            <MaterialCommunityIcons
              name="audio-video"
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
        {selectedSeason === null && (
          <>
            {isLoading && (
              <View className="flex-1 items-center justify-center">
                <ActivityIndicator
                  size="large"
                  color={defaultTheme.extend.colors.buttons.purple}
                />
              </View>
            )}
            {data && (
              <ScrollView
                className="flex-1 flex-col bg-gray-900"
                contentContainerStyle={{
                  padding: 10,
                }}
              >
                <Text className="text-center font-bold">
                  {data.result.name}
                </Text>
                <Divider />
                {data.result.seasons.map((season) => (
                  <TouchableOpacity
                    key={season.season_number}
                    className="m-1 flex flex-row items-center p-2"
                    onPress={() => setSelectedSeason(season.season_number)}
                  >
                    <Text className="flex-grow">
                      Season {season.season_number}
                    </Text>
                    <Ionicons name="chevron-forward" size={24} color="white" />
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}
          </>
        )}
        {selectedSeason !== null && (
          <EpisodeSelector
            seasonNumber={selectedSeason}
            setSelectedSeason={setSelectedSeason}
            closeModal={off}
          />
        )}
      </Modal>
    </View>
  );
};
