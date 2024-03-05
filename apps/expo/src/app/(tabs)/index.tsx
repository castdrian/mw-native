import { ScrollView, View } from "react-native";
import { useSharedValue, withTiming } from "react-native-reanimated";

import type { ItemData } from "~/components/item/item";
import Item from "~/components/item/item";
import ScreenLayout from "~/components/layout/ScreenLayout";
import { Text } from "~/components/ui/Text";

export default function HomeScreen() {
  const fadeAnim = useSharedValue(1);

  const handleScrollBegin = () => {
    fadeAnim.value = withTiming(0, {
      duration: 100,
    });
  };

  const handleScrollEnd = () => {
    fadeAnim.value = withTiming(1, {
      duration: 100,
    });
  };

  const bookmarks: ItemData[] = [
    {
      id: "219651",
      title: "Welcome to Samdal-ri",
      posterUrl:
        "https://www.themoviedb.org/t/p/w185/98IvA2i0PsTY8CThoHByCKOEAjz.jpg",
      type: "tv",
      year: 2023,
    },
    {
      id: "194797",
      title: "Doona!",
      posterUrl:
        "https://www.themoviedb.org/t/p/w185/bQhiOkU3lCu5pwCqPdNVG5GBLlj.jpg",
      type: "tv",
      year: 2023,
    },
  ];

  const watching: ItemData[] = [
    {
      id: "113268",
      title: "The Uncanny Counter",
      posterUrl:
        "https://www.themoviedb.org/t/p/w185/tKU34QiJUfVipcuhAs5S3TdCpAF.jpg",
      type: "tv",
      year: 2020,
    },
    {
      id: "203508",
      title: "Earth Arcade",
      posterUrl:
        "https://www.themoviedb.org/t/p/w185/vBJ0uF0WlFcjr9obZZqE6GSsKoL.jpg",
      type: "tv",
      year: 2022,
    },
  ];

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        onScrollBeginDrag={handleScrollBegin}
        onMomentumScrollEnd={handleScrollEnd}
        scrollEnabled={
          bookmarks.length > 0 || watching.length > 0 ? true : false
        }
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
      >
        <ScreenLayout
          title={
            <View className="flex-row items-center">
              <Text className="text-2xl font-bold">Home</Text>
            </View>
          }
        >
          <Text className="mb-2 mt-4 text-xl font-semibold">Bookmarks</Text>
          <View className="flex w-full flex-1 flex-row flex-wrap justify-start">
            {bookmarks?.map((item, index) => (
              <View key={index} className="basis-1/2 px-3 pb-3">
                <Item data={item} />
              </View>
            ))}
          </View>

          <Text className="mb-2 mt-4 text-xl font-semibold">
            Continue Watching
          </Text>
          <View className="flex w-full flex-1 flex-row flex-wrap justify-start">
            {watching?.map((item, index) => (
              <View key={index} className="basis-1/2 px-3 pb-3">
                <Item data={item} />
              </View>
            ))}
          </View>
        </ScreenLayout>
      </ScrollView>
    </View>
  );
}
