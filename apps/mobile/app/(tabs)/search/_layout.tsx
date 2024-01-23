import { ScrollView } from 'react-native';

import Searchbar from './Searchbar';
import Item from '../../../components/item/item';
import ScreenLayout from '../../../components/layout/ScreenLayout';
import { StyledText, StyledView } from '../../../components/ui/Styled';

export default function SearchScreen() {
  return (
    <ScrollView>
      <ScreenLayout
        title={
          <StyledView className="flex-row items-center">
            <StyledText className="text-2xl font-bold">Search</StyledText>
          </StyledView>
        }
        subtitle="Looking for something?"
      >
        <Searchbar />
        <StyledView className="flex w-full flex-1 flex-row flex-wrap justify-start">
          <StyledView className="basis-1/2 px-3 pb-3">
            <Item />
          </StyledView>
          <StyledView className="basis-1/2 px-3 pb-3">
            <Item />
          </StyledView>
          <StyledView className="basis-1/2 px-3 pb-3">
            <Item />
          </StyledView>
        </StyledView>
      </ScreenLayout>
    </ScrollView>
  );
}
