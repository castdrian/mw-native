import { useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Dimensions, ScrollView, View } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';

import Searchbar from './Searchbar';
import styles from './styles';
import Item from '../../../components/item/item';
import ScreenLayout from '../../../components/layout/ScreenLayout';
import { BoldText } from '../../../components/ui/Text';
import { globalStyles } from '../../../styles/global';

export default function SearchScreen() {
  return (
    <ScrollView>
      <ScreenLayout
        title={
          <View className="flex-row items-center">
            <BoldText className="text-2xl font-bold text-white">
              Search
            </BoldText>
          </View>
        }
        subtitle="Looking for something?"
      >
        <Searchbar />
        <View className="flex w-full flex-1 flex-row flex-wrap justify-start">
          <View className="basis-1/2 px-3 pb-3">
            <Item />
          </View>
          <View className="basis-1/2 px-3 pb-3">
            <Item />
          </View>
          <View className="basis-1/2 px-3 pb-3">
            <Item />
          </View>
        </View>
      </ScreenLayout>
    </ScrollView>
  );
}
