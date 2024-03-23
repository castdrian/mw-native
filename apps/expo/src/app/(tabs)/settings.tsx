import type { SelectProps } from "tamagui";
import React, { useEffect, useState } from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import * as Application from "expo-application";
import * as Linking from "expo-linking";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { useToastController } from "@tamagui/toast";
import {
  Adapt,
  Label,
  Select,
  Separator,
  Sheet,
  Switch,
  Text,
  useTheme,
  View,
  XStack,
  YStack,
} from "tamagui";

import type { ThemeStoreOption } from "~/stores/theme";
import ScreenLayout from "~/components/layout/ScreenLayout";
import { checkForUpdate } from "~/lib/update";
import { getGestureControls, saveGestureControls } from "~/settings";
import { useThemeStore } from "~/stores/theme";

const themeOptions: ThemeStoreOption[] = [
  "main",
  "blue",
  "gray",
  "red",
  "teal",
];

export default function SettingsScreen() {
  const [gestureControlsEnabled, setGestureControlsEnabled] = useState(true);
  const toastController = useToastController();

  useEffect(() => {
    void getGestureControls().then((enabled) => {
      setGestureControlsEnabled(enabled);
    });
  }, []);

  const handleGestureControlsToggle = async (isEnabled: boolean) => {
    setGestureControlsEnabled(isEnabled);
    await saveGestureControls(isEnabled);
  };

  const handleVersionPress = async () => {
    const url = await checkForUpdate();
    if (url) {
      toastController.show("Update available", {
        burntOptions: { preset: "none" },
        native: true,
      });
      await Linking.openURL(url);
    } else {
      toastController.show("No updates available", {
        burntOptions: { preset: "none" },
        native: true,
      });
    }
  };

  return (
    <ScreenLayout title="Settings">
      <View padding={4}>
        <YStack>
          <XStack width={200} alignItems="center" gap="$4">
            <Label minWidth={110}>Theme</Label>
            <Separator minHeight={20} vertical />
            <ThemeSelector />
          </XStack>
          <XStack width={200} alignItems="center" gap="$4">
            <Label minWidth={110}>Gesture controls</Label>
            <Separator minHeight={20} vertical />
            <Switch
              size="$4"
              native
              checked={gestureControlsEnabled}
              onCheckedChange={handleGestureControlsToggle}
            >
              <Switch.Thumb animation="quicker" />
            </Switch>
          </XStack>
        </YStack>
      </View>
      <View justifyContent="center" alignItems="center">
        <TouchableOpacity onPress={handleVersionPress}>
          <Text fontSize={14} color="white">
            v{Application.nativeApplicationVersion}
          </Text>
        </TouchableOpacity>
      </View>
    </ScreenLayout>
  );
}

export function ThemeSelector(props: SelectProps) {
  const theme = useTheme();
  const themeStore = useThemeStore((s) => s.theme);
  const setTheme = useThemeStore((s) => s.setTheme);

  return (
    <Select
      value={themeStore}
      onValueChange={setTheme}
      disablePreventBodyScroll
      native
      {...props}
    >
      <Select.Trigger
        maxWidth="$12"
        iconAfter={<FontAwesome name="chevron-down" />}
      >
        <Select.Value />
      </Select.Trigger>

      <Adapt platform="native">
        <Sheet
          modal
          dismissOnSnapToBottom
          dismissOnOverlayPress
          animationConfig={{
            type: "spring",
            damping: 20,
            mass: 1.2,
            stiffness: 250,
          }}
          snapPoints={[35]}
        >
          <Sheet.Handle backgroundColor="$sheetHandle" />
          <Sheet.Frame backgroundColor="$sheetBackground" padding="$5">
            <Adapt.Contents />
          </Sheet.Frame>
          <Sheet.Overlay
            animation="lazy"
            backgroundColor="rgba(0, 0, 0, 0.8)"
            enterStyle={{ opacity: 0 }}
            exitStyle={{ opacity: 0 }}
          />
        </Sheet>
      </Adapt>

      <Select.Content>
        <Select.Viewport
          animation="static"
          animateOnly={["transform", "opacity"]}
          enterStyle={{ o: 0, y: -10 }}
          exitStyle={{ o: 0, y: 10 }}
        >
          {themeOptions.map((item, i) => {
            return (
              <Select.Item
                index={i}
                key={item}
                value={item}
                backgroundColor="$sheetItemBackground"
                borderTopRightRadius={i === 0 ? "$8" : 0}
                borderTopLeftRadius={i === 0 ? "$8" : 0}
                borderBottomRightRadius={
                  i === themeOptions.length - 1 ? "$8" : 0
                }
                borderBottomLeftRadius={
                  i === themeOptions.length - 1 ? "$8" : 0
                }
              >
                <Select.ItemText>{item}</Select.ItemText>
                <Select.ItemIndicator ml="auto">
                  <MaterialIcons
                    name="check-circle"
                    size={24}
                    color={theme.sheetItemSelected.val}
                  />
                </Select.ItemIndicator>
              </Select.Item>
            );
          })}
        </Select.Viewport>
      </Select.Content>
    </Select>
  );
}
