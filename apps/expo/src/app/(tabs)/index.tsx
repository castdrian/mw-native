import React from "react";
import { View } from "tamagui";

import { ItemListSection, watching } from "~/components/item/ItemListSection";
import ScreenLayout from "~/components/layout/ScreenLayout";
import { useBookmarkStore } from "~/stores/settings";

export default function HomeScreen() {
  const { bookmarks } = useBookmarkStore();

  return (
    <View style={{ flex: 1 }} flex={1}>
      <ScreenLayout title="Home">
        <ItemListSection title="Bookmarks" items={bookmarks} />
        <ItemListSection
          title="Continue Watching"
          items={watching.concat(bookmarks)}
        />
      </ScreenLayout>
    </View>
  );
}
