import type { SheetProps } from "tamagui";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTheme } from "tamagui";

import { usePlaybackSpeed } from "~/hooks/player/usePlaybackSpeed";
import { Settings } from "./settings/Sheet";

export const PlaybackSpeedSelector = (props: SheetProps) => {
  const theme = useTheme();
  const { speeds, currentSpeed, changePlaybackSpeed } = usePlaybackSpeed();

  return (
    <Settings.Sheet
      forceRemoveScrollEnabled={props.open}
      open={props.open}
      onOpenChange={props.onOpenChange}
    >
      <Settings.SheetOverlay />
      <Settings.SheetHandle />
      <Settings.SheetFrame>
        <Settings.Header
          icon={
            <MaterialCommunityIcons
              name="close"
              size={24}
              color={theme.playerSettingsUnactiveText.val}
              onPress={() => props.onOpenChange?.(false)}
            />
          }
          title="Playback settings"
        />
        <Settings.Content>
          {speeds.map((speed) => (
            <Settings.Item
              key={speed}
              title={`${speed}x`}
              iconRight={
                speed === currentSpeed && (
                  <MaterialCommunityIcons
                    name="check-circle"
                    size={24}
                    color={theme.sheetItemSelected.val}
                  />
                )
              }
              onPress={() => {
                changePlaybackSpeed(speed)
                  .then(() => props.onOpenChange?.(false))
                  .catch((err) => {
                    console.log("error", err);
                  });
              }}
            />
          ))}
        </Settings.Content>
      </Settings.SheetFrame>
    </Settings.Sheet>
  );
};
