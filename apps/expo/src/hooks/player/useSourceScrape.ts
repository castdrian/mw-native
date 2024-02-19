import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  getVideoStreamFromEmbed,
  getVideoStreamFromSource,
} from "@movie-web/provider-utils";

import { convertMetaToScrapeMedia } from "~/stores/player/slices/video";
import { usePlayerStore } from "~/stores/player/store";

export const useEmbedScrape = (closeModal?: () => void) => {
  const setCurrentStream = usePlayerStore((state) => state.setCurrentStream);

  const queryClient = useQueryClient();

  const mutate = useMutation({
    mutationKey: ["embedScrape"],
    mutationFn: async ({
      url,
      embedId,
    }: {
      url: string;
      embedId: string;
      sourceId: string;
    }) => {
      const result = await getVideoStreamFromEmbed({
        url,
        embedId,
      });
      if (result.stream) {
        closeModal?.();
        setCurrentStream(result.stream[0]!);
        return result.stream;
      }
      return result.stream;
    },
    onSuccess: async () => {
      await queryClient.resetQueries({
        queryKey: ["sourceScrape"],
      });
    },
  });
  return mutate;
};

export const useSourceScrape = (
  sourceId: string | null,
  closeModal: () => void,
) => {
  const meta = usePlayerStore((state) => state.meta);
  const setCurrentStream = usePlayerStore((state) => state.setCurrentStream);
  const setSourceId = usePlayerStore((state) => state.setSourceId);

  const query = useQuery({
    queryKey: ["sourceScrape", meta, sourceId],
    queryFn: async () => {
      if (!meta || !sourceId) return;
      const scrapeMedia = convertMetaToScrapeMedia(meta);
      const result = await getVideoStreamFromSource({
        sourceId,
        media: scrapeMedia,
        events: {
          update(evt) {
            console.log(evt);
          },
        },
      });

      if (result.stream) {
        closeModal();
        setCurrentStream(result.stream[0]!);
        setSourceId(sourceId);
        return [];
      }
      if (result.embeds.length === 1) {
        const embedResult = await getVideoStreamFromEmbed(result.embeds[0]!);
        if (embedResult.stream) {
          closeModal();
          setCurrentStream(embedResult.stream[0]!);
          setSourceId(sourceId);
          return [];
        }
      }
      return result.embeds;
    },
  });

  return query;
};
