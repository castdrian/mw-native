import { FontAwesome5 } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';
import { useCallback, useRef, useState } from 'react';
import { TextInput } from 'react-native-gesture-handler';

import { StyledView } from '../../../components/ui/Styled';
import useTailwind from '../../hooks/useTailwind';

export default function Searchbar() {
  const { colors } = useTailwind();
  const [keyword, setKeyword] = useState('');
  const inputRef = useRef<TextInput>(null);

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

  return (
    <StyledView className="mb-6 mt-4 flex-row items-center rounded-full border">
      <StyledView className="ml-1 w-12 items-center justify-center">
        <FontAwesome5 name="search" size={18} color={colors.shade[200]} />
      </StyledView>
      <TextInput
        value={keyword}
        autoFocus
        onChangeText={(text) => setKeyword(text)}
        ref={inputRef}
        placeholder="What are you looking for?"
        placeholderTextColor={colors.shade[200]}
        className="w-full rounded-3xl py-3 pr-5 text-white"
      />
    </StyledView>
  );
}
