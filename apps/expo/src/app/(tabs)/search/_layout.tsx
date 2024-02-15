import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Keyboard,
  Platform,
  ScrollView,
  View,
} from "react-native";

import { getMediaPoster, searchTitle } from "@movie-web/tmdb";

import type { ItemData } from "~/components/item/item";
import Item from "~/components/item/item";
import ScreenLayout from "~/components/layout/ScreenLayout";
import { Text } from "~/components/ui/Text";
import Searchbar from "./Searchbar";

export default function SearchScreen() {
  const [searchResults, setSearchResults] = useState<ItemData[]>([]);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const translateYAnim = useRef(new Animated.Value(0)).current;

  const handleSearchChange = async (query: string) => {
    if (query.length > 0) {
      const results = await fetchSearchResults(query).catch(() => []);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      (e) => {
        const screenHeight = Dimensions.get("window").height;
        const endY = e.endCoordinates.screenY;
        const translateY = screenHeight - endY;

        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(translateYAnim, {
            toValue:
              -translateY +
              Platform.select({ ios: 100, android: 300, default: 0 }),
            duration: 200,
            useNativeDriver: true,
          }),
        ]).start();
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(translateYAnim, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }),
        ]).start();
      },
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, [fadeAnim, translateYAnim]);

  const handleScrollBegin = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 100,
      useNativeDriver: true,
    }).start();
  };

  const handleScrollEnd = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 100,
      useNativeDriver: true,
    }).start();
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        onScrollBeginDrag={handleScrollBegin}
        onMomentumScrollEnd={handleScrollEnd}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
      >
        <ScreenLayout
          title={
            <View className="flex-row items-center">
              <Text className="text-2xl font-bold">Search</Text>
            </View>
          }
        >
          <View className="flex w-full flex-1 flex-row flex-wrap justify-start">
            {searchResults.map((item, index) => (
              <View key={index} className="basis-1/2 px-3 pb-3">
                <Item data={item} />
              </View>
            ))}
          </View>
        </ScreenLayout>
      </ScrollView>
      <Animated.View
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          transform: [{ translateY: translateYAnim }],
          opacity: fadeAnim,
        }}
      >
        <Searchbar onSearchChange={handleSearchChange} />
      </Animated.View>
    </View>
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
