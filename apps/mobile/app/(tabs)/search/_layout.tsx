import { Dimensions, ScrollView, View } from 'react-native';

import { globalStyles } from '../../../styles/global';
import ScreenLayout from '../../../components/layout/screenLayout';
import { TextInput } from 'react-native-gesture-handler';
import styles from './styles';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import { BoldText } from '../../../components/Styled';
import Item from '../../../components/item/item';
import Searchbar from './Searchbar';

export default function SearchScreen() {
  return (
    <ScrollView>
      <ScreenLayout
        title={
          <View
            style={{ ...globalStyles.flexRow, ...globalStyles.itemsCenter }}
          >
            <BoldText style={globalStyles.sectionTitle}>Search</BoldText>
          </View>
        }
        subtitle="Looking for something?"
      >
        <Searchbar />
        <View style={styles.items}>
          <View style={styles.itemOuter}>
            <Item />
          </View>
          <View style={styles.itemOuter}>
            <Item />
          </View>
          <View style={styles.itemOuter}>
            <Item />
          </View>
        </View>
      </ScreenLayout>
    </ScrollView>
  );
}
