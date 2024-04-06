import * as Haptics from "expo-haptics";
import { Text, useTheme, View } from "tamagui";

import { MovieWebSvg } from "./Icon";

export function BrandPill() {
  const theme = useTheme();
  return (
    <View
      flexDirection="row"
      alignItems="center"
      justifyContent="center"
      paddingHorizontal="$3"
      paddingVertical="$2.5"
      gap="$2.5"
      opacity={0.8}
      backgroundColor="$pillBackground"
      borderRadius={24}
      pressStyle={{
        opacity: 1,
        scale: 1.05,
      }}
      onLongPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)}
    >
      <MovieWebSvg
        fillColor={theme.tabBarIconFocused.val}
        width={20}
        height={20}
      />
      <Text fontSize="$6" fontWeight="$bold">
        movie-web
      </Text>
    </View>
  );
}
