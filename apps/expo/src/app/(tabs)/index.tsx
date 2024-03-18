import React from "react";
import { Text, View } from "tamagui";

import {
  bookmarks,
  ItemListSection,
  watching,
} from "~/components/item/ItemListSection";
import ScreenLayout from "~/components/layout/ScreenLayout";

export default function HomeScreen() {
  return (
    <View style={{ flex: 1 }} flex={1}>
      <ScreenLayout
        title={
          <View flexDirection="row" alignItems="center">
            <Text fontWeight="bold" fontSize={20}>
              Home
            </Text>
          </View>
        }
      >
        <ItemListSection title="Bookmarks" items={bookmarks.concat(watching)} />
        <ItemListSection
          title="Continue Watching"
          items={watching.concat(bookmarks)}
        />
      </ScreenLayout>
    </View>
  );
}
