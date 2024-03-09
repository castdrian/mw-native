import React from "react";
import { ScrollView, View } from "react-native";

import {
  bookmarks,
  ItemListSection,
  watching,
} from "~/components/item/ItemListSection";
import ScreenLayout from "~/components/layout/ScreenLayout";
import { Text } from "~/components/ui/Text";

export default function HomeScreen() {
  return (
    <View style={{ flex: 1 }}>
      <ScreenLayout
        title={
          <View className="flex-row items-center">
            <Text className="text-2xl font-bold">Home</Text>
          </View>
        }
      >
        <ScrollView
          scrollEnabled={
            bookmarks.length > 0 || watching.length > 0 ? true : false
          }
        >
          <ItemListSection
            title="Bookmarks"
            items={bookmarks.concat(watching)}
          />
          <ItemListSection
            title="Continue Watching"
            items={watching.concat(bookmarks)}
          />
        </ScrollView>
      </ScreenLayout>
    </View>
  );
}
