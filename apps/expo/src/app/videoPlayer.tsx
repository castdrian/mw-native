import { useLocalSearchParams, useRouter } from "expo-router";

import type { ItemData } from "~/components/item/item";
import { ScraperProcess } from "~/components/player/ScraperProcess";
import { VideoPlayer } from "~/components/player/VideoPlayer";
import { usePlayer } from "~/hooks/player/usePlayer";
import { PlayerStatus } from "~/stores/player/slices/interface";
import { usePlayerStore } from "~/stores/player/store";

export default function VideoPlayerWrapper() {
  const playerStatus = usePlayerStore((state) => state.interface.playerStatus);
  const { presentFullscreenPlayer } = usePlayer();

  const router = useRouter();
  const params = useLocalSearchParams();
  const data = params.data
    ? (JSON.parse(params.data as string) as ItemData)
    : null;

  if (!data) return router.back();

  void presentFullscreenPlayer();

  if (playerStatus === PlayerStatus.SCRAPING)
    return <ScraperProcess data={data} />;

  if (playerStatus === PlayerStatus.READY) return <VideoPlayer />;
}
