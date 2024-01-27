import { FontAwesome5 } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';
import { useCallback, useRef, useState } from 'react';
import { View } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import Colors from '../../constants/Colors';

export default function Searchbar() {
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
    <View className="border-primary-400 focus-within:border-primary-300 mb-6 mt-4 flex-row items-center rounded-full border">
      <View className="ml-1 w-12 items-center justify-center">
        <FontAwesome5 name="search" size={18} color={Colors.secondary[200]} />
      </View>
      <TextInput
        value={keyword}
        autoFocus
        onChangeText={(text) => setKeyword(text)}
        ref={inputRef}
        placeholder="What are you looking for?"
        placeholderTextColor={Colors.secondary[200]}
        className="w-full rounded-3xl py-3 pr-5 text-white focus-visible:outline-none"
      />
    </View>
  );
}
