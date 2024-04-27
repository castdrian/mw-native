import { useLocalSearchParams } from "expo-router";

import type { ScrapeMedia } from "@movie-web/provider-utils";

import type { ItemData } from "~/components/item/item";
import { ScraperProcess } from "~/components/player/ScraperProcess";
import { VideoPlayer } from "~/components/player/VideoPlayer";
import { usePlayer } from "~/hooks/player/usePlayer";
import { PlayerStatus } from "~/stores/player/slices/interface";
import { usePlayerStore } from "~/stores/player/store";

export default function VideoPlayerWrapper() {
  const playerStatus = usePlayerStore((state) => state.interface.playerStatus);
  const { presentFullscreenPlayer } = usePlayer();

  const params = useLocalSearchParams();
  let data;
  if ("data" in params) {
    if (typeof params.data === "string") {
      data = JSON.parse(params.data) as Partial<ItemData>;
    } else {
      data = undefined;
    }
  } else {
    data = params as Partial<ItemData>;
  }
  const media = params.media
    ? (JSON.parse(params.media as string) as ScrapeMedia)
    : undefined;
  const download = params.download === "true";

  void presentFullscreenPlayer();

  if (download) {
    return <ScraperProcess data={data} download />;
  }

  if (playerStatus === PlayerStatus.SCRAPING) {
    return <ScraperProcess data={data} media={media} />;
  }

  if (playerStatus === PlayerStatus.READY) {
    return <VideoPlayer />;
  }
}
