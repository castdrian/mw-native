import { ScrollView, View } from "react-native";
import { useSharedValue, withTiming } from "react-native-reanimated";

import {
  bookmarks,
  ItemListSection,
  watching,
} from "~/components/item/ItemListSection";
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
          <ItemListSection title="Bookmarks" items={bookmarks} />
          <ItemListSection title="Continue Watching" items={watching} />
        </ScreenLayout>
      </ScrollView>
    </View>
  );
}
