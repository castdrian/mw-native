import type { SelectProps } from "tamagui";
import React, { useState } from "react";
import { Platform } from "react-native";
import Markdown from "react-native-markdown-display";
import * as Application from "expo-application";
import * as Brightness from "expo-brightness";
import * as FileSystem from "expo-file-system";
import * as WebBrowser from "expo-web-browser";
import {
  FontAwesome,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { useMutation } from "@tanstack/react-query";
import {
  Adapt,
  ScrollView,
  Select,
  Sheet,
  Spinner,
  Text,
  useTheme,
  View,
  XStack,
  YStack,
} from "tamagui";

import type { ThemeStoreOption } from "~/stores/theme";
import ScreenLayout from "~/components/layout/ScreenLayout";
import { MWButton } from "~/components/ui/Button";
import { MWSelect } from "~/components/ui/Select";
import { MWSeparator } from "~/components/ui/Separator";
import { MWSwitch } from "~/components/ui/Switch";
import { useToast } from "~/hooks/useToast";
import { checkForUpdate } from "~/lib/update";
import {
  useNetworkSettingsStore,
  usePlayerSettingsStore,
} from "~/stores/settings";
import { useThemeStore } from "~/stores/theme";

const themeOptions: ThemeStoreOption[] = [
  "main",
  "blue",
  "gray",
  "red",
  "teal",
];

const defaultQualityOptions = ["Highest", "Lowest"];

export default function SettingsScreen() {
  const theme = useTheme();
  const { gestureControls, setGestureControls, autoPlay, setAutoPlay } =
    usePlayerSettingsStore();
  const { allowMobileData, setAllowMobileData } = useNetworkSettingsStore();
  const [showUpdateSheet, setShowUpdateSheet] = useState(false);
  const [updateMarkdownContent, setUpdateMarkdownContent] = useState("");
  const [downloadUrl, setDownloadUrl] = useState("");
  const { showToast } = useToast();

  const mutation = useMutation({
    mutationKey: ["checkForUpdate"],
    mutationFn: checkForUpdate,
    onSuccess: (res) => {
      if (res) {
        setUpdateMarkdownContent(res.data.body!);
        setDownloadUrl(
          res.data.assets.find(
            (asset) =>
              asset.name ===
              `movie-web.${Platform.select({ ios: "ipa", android: "apk" })}`,
          )?.browser_download_url ?? "",
        );
        setShowUpdateSheet(true);
      } else {
        showToast("No updates available");
      }
    },
  });

  const handleGestureControlsToggle = async (isEnabled: boolean) => {
    if (isEnabled) {
      const { status } = await Brightness.requestPermissionsAsync();
      if (status === Brightness.PermissionStatus.GRANTED) {
        setGestureControls(isEnabled);
      }
    } else {
      setGestureControls(isEnabled);
    }
  };

  const clearCacheDirectory = async () => {
    const cacheDirectory = `${FileSystem.cacheDirectory}movie-web`;
    if (!cacheDirectory) return;

    try {
      await FileSystem.deleteAsync(cacheDirectory, { idempotent: true });
      showToast("Cache cleared", {
        burntOptions: { preset: "done" },
      });
    } catch (error) {
      console.error("Error clearing cache directory:", error);
      showToast("Error clearing cache", {
        burntOptions: { preset: "error" },
      });
    }
  };

  return (
    <ScreenLayout>
      <View>
        <YStack gap="$8">
          <YStack gap="$4">
            <Text fontSize="$7" fontWeight="$bold">
              Appearance
            </Text>
            <MWSeparator />
            <YStack gap="$2">
              <XStack gap="$4" alignItems="center">
                <Text fontWeight="$semibold" flexGrow={1}>
                  Theme
                </Text>
                <ThemeSelector />
              </XStack>
            </YStack>
          </YStack>

          <YStack gap="$4">
            <Text fontSize="$7" fontWeight="$bold">
              Player
            </Text>
            <MWSeparator />
            <YStack gap="$2">
              <XStack gap="$4" alignItems="center">
                <Text fontWeight="$semibold" flexGrow={1}>
                  Gesture controls
                </Text>
                <MWSwitch
                  checked={gestureControls}
                  onCheckedChange={handleGestureControlsToggle}
                >
                  <MWSwitch.Thumb />
                </MWSwitch>
              </XStack>
              <XStack gap="$4" alignItems="center">
                <Text fontWeight="$semibold" flexGrow={1}>
                  Autoplay
                </Text>
                <MWSwitch checked={autoPlay} onCheckedChange={setAutoPlay}>
                  <MWSwitch.Thumb />
                </MWSwitch>
              </XStack>
            </YStack>
          </YStack>

          <YStack gap="$4">
            <Text fontSize="$7" fontWeight="$bold">
              Network
            </Text>
            <MWSeparator />
            <YStack gap="$2">
              <XStack gap="$4" alignItems="center">
                <Text fontWeight="$semibold" flexGrow={1}>
                  Default quality (Wi-Fi)
                </Text>
                <DefaultQualitySelector qualityType="wifi" />
              </XStack>
              <XStack gap="$4" alignItems="center">
                <Text fontWeight="$semibold" flexGrow={1}>
                  Default quality (Data)
                </Text>
                <DefaultQualitySelector qualityType="data" />
              </XStack>
              <XStack gap="$3" alignItems="center">
                <Text fontWeight="$semibold" flexGrow={1}>
                  Allow downloads on mobile data
                </Text>
                <MWSwitch
                  checked={allowMobileData}
                  onCheckedChange={setAllowMobileData}
                >
                  <MWSwitch.Thumb />
                </MWSwitch>
              </XStack>
            </YStack>
          </YStack>

          <YStack gap="$4">
            <Text fontSize="$7" fontWeight="$bold">
              App
            </Text>
            <MWSeparator />
            <YStack gap="$2">
              <XStack gap="$4" alignItems="center">
                <Text fontWeight="$semibold" flexGrow={1}>
                  Version {Application.nativeApplicationVersion}
                </Text>
                <MWButton
                  type="secondary"
                  backgroundColor="$sheetItemBackground"
                  icon={
                    <MaterialCommunityIcons
                      name={Platform.select({
                        ios: "apple",
                        android: "android",
                      })}
                      size={24}
                      color={theme.silver300.val}
                    />
                  }
                  iconAfter={
                    <>{mutation.isPending && <Spinner color="$purple200" />}</>
                  }
                  disabled={mutation.isPending}
                  onPress={() => mutation.mutate()}
                >
                  Update
                </MWButton>
              </XStack>
              <XStack gap="$4" alignItems="center">
                <Text fontWeight="$semibold" flexGrow={1}>
                  Storage
                </Text>
                <MWButton
                  type="secondary"
                  backgroundColor="$sheetItemBackground"
                  icon={
                    <MaterialCommunityIcons
                      name="broom"
                      size={24}
                      color={theme.silver300.val}
                    />
                  }
                  onPress={() => clearCacheDirectory()}
                >
                  Clear Cache
                </MWButton>
              </XStack>
            </YStack>
          </YStack>
        </YStack>
      </View>
      <UpdateSheet
        markdownContent={updateMarkdownContent}
        open={showUpdateSheet}
        setShowUpdateSheet={setShowUpdateSheet}
        downloadUrl={downloadUrl}
      />
    </ScreenLayout>
  );
}

export function UpdateSheet({
  markdownContent,
  open,
  setShowUpdateSheet,
  downloadUrl,
}: {
  markdownContent: string;
  open: boolean;
  setShowUpdateSheet: (value: boolean) => void;
  downloadUrl: string;
}) {
  const theme = useTheme();

  return (
    <Sheet
      modal
      open={open}
      onOpenChange={setShowUpdateSheet}
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
      <Sheet.Frame
        backgroundColor="$sheetBackground"
        padding="$4"
        alignItems="center"
        justifyContent="center"
      >
        <ScrollView>
          <Markdown
            style={{
              text: {
                color: "white",
              },
            }}
          >
            {markdownContent}
          </Markdown>
        </ScrollView>
        <MWButton
          type="secondary"
          backgroundColor="$sheetItemBackground"
          icon={
            <MaterialCommunityIcons
              name={Platform.select({ ios: "apple", android: "android" })}
              size={24}
              color={theme.silver300.val}
            />
          }
          onPress={() => WebBrowser.openBrowserAsync(downloadUrl)}
        >
          Download
        </MWButton>
      </Sheet.Frame>
      <Sheet.Overlay
        animation="lazy"
        backgroundColor="rgba(0, 0, 0, 0.8)"
        enterStyle={{ opacity: 0 }}
        exitStyle={{ opacity: 0 }}
      />
    </Sheet>
  );
}

export function ThemeSelector(props: SelectProps) {
  const theme = useTheme();
  const themeStore = useThemeStore((s) => s.theme);
  const setTheme = useThemeStore((s) => s.setTheme);

  return (
    <MWSelect
      value={themeStore}
      onValueChange={setTheme}
      disablePreventBodyScroll
      {...props}
    >
      <MWSelect.Trigger
        maxWidth="$12"
        iconAfter={
          <FontAwesome name="chevron-down" color={theme.inputIconColor.val} />
        }
      >
        <Select.Value fontWeight="$semibold" textTransform="capitalize" />
      </MWSelect.Trigger>

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
          <Sheet.Frame
            backgroundColor="$sheetBackground"
            padding="$4"
            alignItems="center"
            justifyContent="center"
          >
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
          {themeOptions.map((item, i) => (
            <Select.Item
              index={i}
              key={item}
              value={item}
              backgroundColor="$sheetItemBackground"
              borderTopRightRadius={i === 0 ? "$8" : 0}
              borderTopLeftRadius={i === 0 ? "$8" : 0}
              borderBottomRightRadius={i === themeOptions.length - 1 ? "$8" : 0}
              borderBottomLeftRadius={i === themeOptions.length - 1 ? "$8" : 0}
            >
              <Select.ItemText
                textTransform="capitalize"
                fontWeight="$semibold"
              >
                {item}
              </Select.ItemText>
              <Select.ItemIndicator ml="auto">
                <MaterialIcons
                  name="check-circle"
                  size={24}
                  color={theme.sheetItemSelected.val}
                />
              </Select.ItemIndicator>
            </Select.Item>
          ))}
        </Select.Viewport>
      </Select.Content>
    </MWSelect>
  );
}

interface DefaultQualitySelectorProps extends SelectProps {
  qualityType: "wifi" | "data";
}

export function DefaultQualitySelector(props: DefaultQualitySelectorProps) {
  const theme = useTheme();
  const {
    wifiDefaultQuality,
    mobileDataDefaultQuality,
    setWifiDefaultQuality,
    setMobileDataDefaultQuality,
  } = useNetworkSettingsStore();

  return (
    <MWSelect
      value={
        props.qualityType === "wifi"
          ? wifiDefaultQuality
          : mobileDataDefaultQuality
      }
      onValueChange={
        props.qualityType === "wifi"
          ? setWifiDefaultQuality
          : setMobileDataDefaultQuality
      }
      disablePreventBodyScroll
      {...props}
    >
      <MWSelect.Trigger
        maxWidth="$10"
        iconAfter={
          <FontAwesome name="chevron-down" color={theme.inputIconColor.val} />
        }
      >
        <Select.Value fontWeight="$semibold" textTransform="capitalize" />
      </MWSelect.Trigger>

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
          <Sheet.Frame
            backgroundColor="$sheetBackground"
            padding="$4"
            alignItems="center"
            justifyContent="center"
          >
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
          {defaultQualityOptions.map((item, i) => (
            <Select.Item
              index={i}
              key={item}
              value={item}
              backgroundColor="$sheetItemBackground"
              borderTopRightRadius={i === 0 ? "$8" : 0}
              borderTopLeftRadius={i === 0 ? "$8" : 0}
              borderBottomRightRadius={
                i === defaultQualityOptions.length - 1 ? "$8" : 0
              }
              borderBottomLeftRadius={
                i === defaultQualityOptions.length - 1 ? "$8" : 0
              }
            >
              <Select.ItemText
                textTransform="capitalize"
                fontWeight="$semibold"
              >
                {item}
              </Select.ItemText>
              <Select.ItemIndicator ml="auto">
                <MaterialIcons
                  name="check-circle"
                  size={24}
                  color={theme.sheetItemSelected.val}
                />
              </Select.ItemIndicator>
            </Select.Item>
          ))}
        </Select.Viewport>
      </Select.Content>
    </MWSelect>
  );
}
