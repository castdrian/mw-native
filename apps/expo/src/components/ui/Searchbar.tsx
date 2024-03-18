import { useContext, useEffect, useRef, useState } from "react";
import { Keyboard } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { Input, styled, useTheme, View } from "tamagui";

import SearchTabContext from "./SearchTabContext";

const SearchInput = styled(Input, {
  backgroundColor: "$searchBackground",
  borderColor: "$colorTransparent",
  placeholderTextColor: "$searchPlaceholder",
  outlineStyle: "none",
  focusStyle: {
    borderColor: "$colorTransparent",
    backgroundColor: "$searchFocused",
  },
});

export function SearchBar({
  onSearchChange,
}: {
  onSearchChange: (text: string) => void;
}) {
  const theme = useTheme();
  const [keyword, setKeyword] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<Input>(null);

  const { focusSearchInputRef } = useContext(SearchTabContext);

  useEffect(() => {
    focusSearchInputRef.current = () => {
      inputRef.current?.focus();
    };
  }, [focusSearchInputRef]);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setIsFocused(true);
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setIsFocused(false);
      },
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const handleChange = (text: string) => {
    setKeyword(text);
    onSearchChange(text);
  };

  return (
    <View
      marginBottom={12}
      flexDirection="row"
      alignItems="center"
      borderRadius={999}
      borderWidth={1}
      backgroundColor={isFocused ? theme.searchFocused : theme.searchBackground}
    >
      <View width={48} alignItems="center" justifyContent="center">
        <FontAwesome5 name="search" size={18} color={theme.searchIcon.val} />
      </View>
      <SearchInput
        value={keyword}
        onChangeText={handleChange}
        ref={inputRef}
        placeholder="What are you looking for?"
        width="80%"
      />
    </View>
  );
}
