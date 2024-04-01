import { Image, Text, View } from "tamagui";

import Icon from "../../assets/images/icon-transparent.png";

export function BrandPill() {
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
    >
      <Image source={Icon} height={20} width={20} />
      <Text fontSize="$4" fontWeight="$bold" paddingRight={5}>
        movie-web
      </Text>
    </View>
  );
}
