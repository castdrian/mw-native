import React from "react";
import { View } from "tamagui";

import {
  bookmarks,
  ItemListSection,
  watching,
} from "~/components/item/ItemListSection";
import ScreenLayout from "~/components/layout/ScreenLayout";

export default function HomeScreen() {
  return (
    <View style={{ flex: 1 }} flex={1}>
      <ScreenLayout title="Home">
        <ItemListSection title="Bookmarks" items={bookmarks.concat(watching)} />
        <ItemListSection
          title="Continue Watching"
          items={watching.concat(bookmarks)}
        />
      </ScreenLayout>
    </View>
  );
}
