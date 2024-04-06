import React from "react";
import { Dimensions } from "react-native";
import { ScrollView, Text, View } from "tamagui";

import type { ItemData } from "~/components/item/item";
import Item from "~/components/item/item";

const padding = 20;
const screenWidth = Dimensions.get("window").width;
const itemWidth = screenWidth / 2.3 - padding;

export const ItemListSection = ({
  title,
  items,
}: {
  title: string;
  items: ItemData[];
}) => {
  return (
    <View>
      <Text marginBottom={8} marginTop={16} fontWeight="bold" fontSize="$8">
        {title}
      </Text>
      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
        {items.map((item, index) => (
          <View key={index} width={itemWidth} paddingBottom={padding}>
            <Item data={item} />
          </View>
        ))}
      </ScrollView>
    </View>
  );
};
