import { ScrollView, Text, View } from 'react-native';

import Searchbar from './Searchbar';
import Item from '../../../components/item/item';
import ScreenLayout from '../../../components/layout/ScreenLayout';

export default function SearchScreen() {
  return (
    <ScrollView>
      <ScreenLayout
        title={
          <View className="flex-row items-center">
            <Text className="text-2xl font-bold">Search</Text>
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
