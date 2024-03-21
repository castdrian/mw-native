import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTheme } from "tamagui";

import { findHighestQuality } from "@movie-web/provider-utils";

import { useDownloadManager } from "~/hooks/DownloadManagerContext";
import { usePlayerStore } from "~/stores/player/store";
import { MWButton } from "../ui/Button";
import { Controls } from "./Controls";

export const DownloadButton = () => {
  const theme = useTheme();
  const stream = usePlayerStore((state) => state.interface.currentStream);
  const { startDownload } = useDownloadManager();
  if (stream?.type !== "file") return null;

  const highestQuality = findHighestQuality(stream);
  const url = highestQuality ? stream.qualities[highestQuality]?.url : null;
  if (!url) return null;

  return (
    <>
      <Controls>
        <MWButton
          type="secondary"
          icon={
            <MaterialCommunityIcons
              name="download"
              size={24}
              color={theme.buttonSecondaryText.val}
            />
          }
          onPress={() => startDownload(url, "mp4")}
        >
          Download
        </MWButton>
      </Controls>
    </>
  );
};
