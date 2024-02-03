import { Image, View } from "react-native";

import { TMDB_POSTER_PATH } from "~/app/constants/General";
import { Text } from "~/components/ui/Text";

export default function Item() {
  return (
    <View className="w-full">
      <View className="mb-2 aspect-[9/14] w-full overflow-hidden rounded-2xl">
        <Image
          source={{
            uri: `${TMDB_POSTER_PATH}/w342//gdIrmf2DdY5mgN6ycVP0XlzKzbE.jpg`,
            width: 200,
          }}
          className="h-full w-full object-cover"
        />
      </View>
      <Text className="font-bold">Hamilton</Text>
      <View className="flex-row items-center gap-3">
        <Text className="text-xs text-gray-600">Movie</Text>
        <View className="h-1 w-1 rounded-3xl bg-gray-600" />
        <Text className="text-sm text-gray-600">2023</Text>
      </View>
    </View>
  );
}
