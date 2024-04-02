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
      paddingHorizontal="$2.5"
      paddingVertical="$2"
      gap={2}
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
        width={12}
        height={12}
      />
      <Text fontSize="$4" fontWeight="$bold" paddingRight={5} paddingLeft={3}>
        {/* padding might need adjusting */}
        movie-web
      </Text>
    </View>
  );
}
