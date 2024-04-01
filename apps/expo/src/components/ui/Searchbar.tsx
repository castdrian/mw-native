import type { Input } from "tamagui";
import { useEffect, useRef, useState } from "react";
import { FontAwesome5 } from "@expo/vector-icons";
import { useIsFocused } from "@react-navigation/native";
import { useTheme, View } from "tamagui";

import { MWInput } from "./Input";

export function SearchBar({
  onSearchChange,
}: {
  onSearchChange: (text: string) => void;
}) {
  const theme = useTheme();
  const pageIsFocused = useIsFocused();
  const [keyword, setKeyword] = useState("");
  const inputRef = useRef<Input>(null);

  useEffect(() => {
    if (pageIsFocused) {
      inputRef.current?.focus();
    }
  }, [pageIsFocused]);

  const handleChange = (text: string) => {
    setKeyword(text);
    onSearchChange(text);
  };

  return (
    <View
      flexDirection="row"
      alignItems="center"
      borderRadius={999}
      borderWidth={1}
      backgroundColor={theme.searchBackground}
    >
      <View width={48} alignItems="center" justifyContent="center">
        <FontAwesome5 name="search" size={18} color={theme.searchIcon.val} />
      </View>
      <MWInput
        type="search"
        value={keyword}
        onChangeText={handleChange}
        ref={inputRef}
        placeholder="What are you looking for?"
        width="75%"
        backgroundColor={theme.searchBackground}
      />
    </View>
  );
}
