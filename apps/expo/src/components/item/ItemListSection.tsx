import React from "react";
import { Dimensions, ScrollView, Text, View } from "react-native";

import type { ItemData } from "~/components/item/item";
import Item from "~/components/item/item";

export const bookmarks: ItemData[] = [
  {
    id: "219651",
    title: "Welcome to Samdal-ri",
    posterUrl:
      "https://www.themoviedb.org/t/p/w500/98IvA2i0PsTY8CThoHByCKOEAjz.jpg",
    type: "tv",
    year: 2023,
  },
  {
    id: "194797",
    title: "Doona!",
    posterUrl:
      "https://www.themoviedb.org/t/p/w500/bQhiOkU3lCu5pwCqPdNVG5GBLlj.jpg",
    type: "tv",
    year: 2023,
  },
];

export const watching: ItemData[] = [
  {
    id: "113268",
    title: "The Uncanny Counter",
    posterUrl:
      "https://www.themoviedb.org/t/p/w500/tKU34QiJUfVipcuhAs5S3TdCpAF.jpg",
    type: "tv",
    year: 2020,
  },
  {
    id: "203508",
    title: "Earth Arcade",
    posterUrl:
      "https://www.themoviedb.org/t/p/w500/vBJ0uF0WlFcjr9obZZqE6GSsKoL.jpg",
    type: "tv",
    year: 2022,
  },
];

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
      <Text className="mb-2 mt-4 text-xl font-semibold text-white">
        {title}
      </Text>
      <ScrollView
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 3 }}
      >
        {items.map((item, index) => (
          <View
            key={index}
            style={{
              width: itemWidth,
              paddingHorizontal: padding / 2,
              paddingBottom: padding,
            }}
          >
            <Item data={item} />
          </View>
        ))}
      </ScrollView>
    </View>
  );
};
