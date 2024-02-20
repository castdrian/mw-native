import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { TextInput, View } from "react-native";
import { useFocusEffect } from "expo-router";
import { FontAwesome5 } from "@expo/vector-icons";

import Colors from "@movie-web/tailwind-config/colors";

import SearchTabContext from "./SearchTabContext";

export default function Searchbar({
  onSearchChange,
}: {
  onSearchChange: (text: string) => void;
}) {
  const [keyword, setKeyword] = useState("");
  const inputRef = useRef<TextInput>(null);

  const { focusSearchInputRef } = useContext(SearchTabContext);

  useEffect(() => {
    focusSearchInputRef.current = () => {
      inputRef.current?.focus();
    };
  }, [focusSearchInputRef]);

  useFocusEffect(
    useCallback(() => {
      // When the screen is focused
      const focus = () => {
        setTimeout(() => {
          inputRef?.current?.focus();
        }, 20);
      };
      focus();
      return focus; // cleanup
    }, []),
  );

  const handleChange = (text: string) => {
    setKeyword(text);
    onSearchChange(text);
  };

  return (
    <View className="mb-6 mt-4 flex-row items-center rounded-full border border-primary-400 bg-black focus-within:border-primary-300">
      <View className="ml-1 w-12 items-center justify-center">
        <FontAwesome5 name="search" size={18} color={Colors.secondary[200]} />
      </View>
      <TextInput
        value={keyword}
        onChangeText={handleChange}
        ref={inputRef}
        placeholder="What are you looking for?"
        placeholderTextColor={Colors.secondary[200]}
        className="w-full rounded-3xl py-3 pr-5 text-white"
      />
    </View>
  );
}
