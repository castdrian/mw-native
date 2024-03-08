import { useContext, useEffect, useRef, useState } from "react";
import { TextInput, View } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";

import { defaultTheme } from "@movie-web/tailwind-config/themes";

import SearchTabContext from "./SearchTabContext";

export function SearchBar({
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

  const handleChange = (text: string) => {
    setKeyword(text);
    onSearchChange(text);
  };

  return (
    <View className="border-primary-400 focus-within:border-primary-300 mb-6 mt-4 flex-row items-center rounded-full border bg-black">
      <View className="ml-1 w-12 items-center justify-center">
        <FontAwesome5
          name="search"
          size={18}
          color={defaultTheme.extend.colors.search.icon}
        />
      </View>
      <TextInput
        value={keyword}
        onChangeText={handleChange}
        ref={inputRef}
        placeholder="What are you looking for?"
        placeholderTextColor={defaultTheme.extend.colors.search.placeholder}
        className="w-full rounded-3xl py-3 pr-5 text-white"
      />
    </View>
  );
}
