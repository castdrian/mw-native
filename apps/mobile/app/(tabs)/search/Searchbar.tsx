import { FontAwesome5 } from '@expo/vector-icons';
import { useCallback, useRef, useState } from 'react';
import { View } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import { globalStyles } from '../../../styles/global';
import Colors from '../../../constants/Colors';
import { useFocusEffect } from 'expo-router';

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
    <View
      style={{
        ...globalStyles.flexRow,
        ...globalStyles.itemsCenter,
        ...globalStyles.border,
        ...globalStyles.roundedFull,
        marginTop: 14,
        marginBottom: 24,
      }}
    >
      <View
        style={{
          ...globalStyles.justifyCenter,
          ...globalStyles.itemsCenter,
          width: 48,
          marginLeft: 4,
        }}
      >
        <FontAwesome5 name="search" size={18} color={Colors.dark.shade200} />
      </View>
      <TextInput
        value={keyword}
        autoFocus={true}
        onChangeText={(text) => setKeyword(text)}
        ref={inputRef}
        placeholder="What are you looking for?"
        placeholderTextColor={Colors.dark.shade200}
        style={[
          globalStyles.input,
          globalStyles.fOpenSansRegular,
          {
            width: '100%',
          },
        ]}
      ></TextInput>
    </View>
  );
}
