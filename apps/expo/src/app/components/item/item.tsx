import { Image, View } from "react-native";
import { Text } from "~/components/ui/Text";

export default function Item({ data }: { data: { title: string, type: string, year: number, posterUrl: string } }) {
  const { title, type, year, posterUrl } = data;

  return (
    <View className="w-full">
      <View className="mb-2 aspect-[9/14] w-full overflow-hidden rounded-2xl">
        <Image
          source={{
            uri: posterUrl,
            width: 200,
          }}
          className="h-full w-full object-cover"
        />
      </View>
      <Text className="font-bold">{title}</Text>
      <View className="flex-row items-center gap-3">
        <Text className="text-xs text-gray-600">{type}</Text>
        <View className="h-1 w-1 rounded-3xl bg-gray-600" />
        <Text className="text-sm text-gray-600">{year}</Text>
      </View>
    </View>
  );
}
