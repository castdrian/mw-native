import { Linking } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import { FontAwesome6, MaterialIcons } from "@expo/vector-icons";
import { Circle, View } from "tamagui";

import { DISCORD_LINK, GITHUB_LINK } from "~/constants/core";
import { BrandPill } from "../BrandPill";

export function Header() {
  const insets = useSafeAreaInsets();

  return (
    <View
      paddingTop={insets.top}
      alignItems="center"
      gap="$3"
      flexDirection="row"
    >
      <BrandPill />

      <Circle
        backgroundColor="$pillBackground"
        size="$4.5"
        pressStyle={{
          opacity: 1,
          scale: 1.05,
        }}
        onPress={async () => {
          await Linking.openURL(DISCORD_LINK);
        }}
        onLongPress={() =>
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)
        }
      >
        <MaterialIcons name="discord" size={32} color="white" />
      </Circle>
      <Circle
        backgroundColor="$pillBackground"
        size="$4.5"
        pressStyle={{
          opacity: 1,
          scale: 1.05,
        }}
        onPress={async () => {
          await Linking.openURL(GITHUB_LINK);
        }}
        onLongPress={() =>
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)
        }
      >
        <FontAwesome6 name="github" size={32} color="white" />
      </Circle>
    </View>
  );
}
