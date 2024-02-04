import React, { useState } from 'react';
import { ScrollView, View } from 'react-native';

import Item from '~/components/item/item';
import { Text } from "~/components/ui/Text";
import ScreenLayout from '~/components/layout/ScreenLayout';
import Searchbar from './Searchbar';
import { searchTitle, getMediaPoster } from '@movie-web/tmdb';

export default function SearchScreen() {
const [searchResults, setSearchResults] = useState<{ title: string; posterUrl: string; year: number; type: "movie" | "tv"; }[]>([]);

const handleSearchChange = async (query: string) => {
	if (query.length > 0) {
		const results = await fetchSearchResults(query);
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

async function fetchSearchResults(query: string): Promise<{ title: string; posterUrl: string; year: number; type: "movie" | "tv"; }[]> {
	console.log('Fetching results for:', query);
	const results = await searchTitle(query);
	
	return results.map((result) => {
	  switch (result.media_type) {
		case 'movie':
		  return {
			title: result.title,
			posterUrl: getMediaPoster(result.poster_path),
			year: new Date(result.release_date).getFullYear(),
			type: result.media_type as "movie",
		  };
		case 'tv':
		  return {
			title: result.name,
			posterUrl: getMediaPoster(result.poster_path),
			year: new Date(result.first_air_date).getFullYear(),
			type: result.media_type as "tv",
		  };
		default:
		  return undefined;
	  }
	}).filter((item): item is { title: string; posterUrl: string; year: number; type: "movie" | "tv"; } => item !== undefined);
  }  
  
  