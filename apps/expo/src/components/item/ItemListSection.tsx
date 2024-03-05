import React from "react";
import { Text, View } from "react-native";

import type { ItemData } from "~/components/item/item";
import Item from "~/components/item/item";

export const bookmarks: ItemData[] = [
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

export const watching: ItemData[] = [
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

export const ItemListSection = ({
  title,
  items,
}: {
  title: string;
  items: ItemData[];
}) => {
  return (
    <View>
      <Text className="mb-2 mt-4 text-xl font-semibold">{title}</Text>
      <View className="flex w-full flex-1 flex-row flex-wrap justify-start">
        {items.map((item, index) => (
          <View key={index} className="basis-1/2 px-3 pb-3">
            <Item data={item} />
          </View>
        ))}
      </View>
    </View>
  );
};
