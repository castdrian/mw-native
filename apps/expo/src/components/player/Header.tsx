import { Text, View } from "tamagui";

import { usePlayerStore } from "~/stores/player/store";
import { BrandPill } from "../BrandPill";
import { BackButton } from "./BackButton";
import { Controls } from "./Controls";
import { mapSeasonAndEpisodeNumberToText } from "./utils";

export const Header = () => {
  const isIdle = usePlayerStore((state) => state.interface.isIdle);
  const meta = usePlayerStore((state) => state.meta);

  if (!isIdle) {
    return (
      <View
        zIndex={50}
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
        height={64}
        paddingHorizontal="$8"
      >
        <View width={150}>
          <Controls>
            <BackButton />
          </Controls>
        </View>
        {meta && (
          <Text fontWeight="bold">
            {meta.title} ({meta.releaseYear}){" "}
            {meta.season !== undefined && meta.episode !== undefined
              ? mapSeasonAndEpisodeNumberToText(
                  meta.season.number,
                  meta.episode.number,
                )
              : ""}
          </Text>
        )}
        <View alignItems="center" justifyContent="center" width={150}>
          <BrandPill />
        </View>
      </View>
    );
  }
};
