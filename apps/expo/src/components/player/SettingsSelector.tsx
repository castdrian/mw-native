import { useState } from "react";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { useTheme } from "tamagui";

import { MWButton } from "../ui/Button";
import { Controls } from "./Controls";
import { PlaybackSpeedSelector } from "./PlaybackSpeedSelector";
import { QualitySelector } from "./QualitySelector";
import { Settings } from "./settings/Sheet";

export const SettingsSelector = () => {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [qualityOpen, setQualityOpen] = useState(false);
  const [playbackOpen, setPlaybackOpen] = useState(false);

  return (
    <>
      <Controls>
        <MWButton
          type="secondary"
          icon={
            <MaterialIcons
              name="display-settings"
              size={24}
              color={theme.silver300.val}
            />
          }
          onPress={() => setOpen(true)}
        >
          Settings
        </MWButton>
      </Controls>

      <Settings.Sheet
        forceRemoveScrollEnabled={open}
        open={open}
        onOpenChange={setOpen}
      >
        <Settings.SheetOverlay />
        <Settings.SheetHandle />
        <Settings.SheetFrame>
          <QualitySelector open={qualityOpen} onOpenChange={setQualityOpen} />
          <PlaybackSpeedSelector
            open={playbackOpen}
            onOpenChange={setPlaybackOpen}
          />
          <Settings.Header
            icon={
              <MaterialIcons
                name="close"
                size={24}
                color={theme.playerSettingsUnactiveText.val}
                onPress={() => setOpen(false)}
              />
            }
            title="Settings"
          />
          <Settings.Content>
            <Settings.Item
              title="Quality"
              iconLeft={
                <MaterialIcons
                  name="hd"
                  size={24}
                  color={theme.playerSettingsUnactiveText.val}
                />
              }
              iconRight={
                <MaterialCommunityIcons
                  name="chevron-right"
                  size={24}
                  color="white"
                />
              }
              onPress={() => setQualityOpen(true)}
            />
            <Settings.Item
              title="Playback speed"
              iconLeft={
                <MaterialIcons
                  name="speed"
                  size={24}
                  color={theme.playerSettingsUnactiveText.val}
                />
              }
              iconRight={
                <MaterialCommunityIcons
                  name="chevron-right"
                  size={24}
                  color="white"
                />
              }
              onPress={() => setPlaybackOpen(true)}
            />
          </Settings.Content>
        </Settings.SheetFrame>
      </Settings.Sheet>
    </>
  );
};
