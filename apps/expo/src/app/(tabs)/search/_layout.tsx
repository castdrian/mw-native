import React, { useState } from "react";
import { ScrollView, View } from "react-native";

import { getMediaPoster, searchTitle } from "@movie-web/tmdb";

import type { ItemData } from "~/components/item/item";
import Item from "~/components/item/item";
import ScreenLayout from "~/components/layout/ScreenLayout";
import { Text } from "~/components/ui/Text";
import Searchbar from "./Searchbar";

export default function SearchScreen() {
  const [searchResults, setSearchResults] = useState<ItemData[]>([]);

  const handleSearchChange = async (query: string) => {
    if (query.length > 0) {
      const results = await fetchSearchResults(query).catch(() => []);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };

  return (
    <ScrollView>
      <ScreenLayout
        title={
          <View className="flex-row items-center">
            <Text className="text-2xl font-bold">Search</Text>
          </View>
        }
        subtitle="Looking for something?"
      >
        <Searchbar onSearchChange={handleSearchChange} />
        <View className="flex w-full flex-1 flex-row flex-wrap justify-start">
          {searchResults.map((item, index) => (
            <View key={index} className="basis-1/2 px-3 pb-3">
              <Item data={item} />
            </View>
          ))}
        </View>
      </ScreenLayout>
    </ScrollView>
  );
}

async function fetchSearchResults(query: string): Promise<ItemData[]> {
  const results = await searchTitle(query);

  return results.map((result) => ({
    id: result.id.toString(),
    title: result.media_type === "tv" ? result.name : result.title,
    posterUrl: getMediaPoster(result.poster_path),
    year: new Date(
      result.media_type === "tv" ? result.first_air_date : result.release_date,
    ).getFullYear(),
    type: result.media_type,
  }));
}
