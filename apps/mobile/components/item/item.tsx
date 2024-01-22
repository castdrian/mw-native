import { Image, View } from 'react-native';

import { TMDB_POSTER_PATH } from '../../constants/General';
import { BoldText, RegularText } from '../ui/Text';

export default function Item() {
  return (
    <View className="w-full">
      <View className="mb-2 aspect-[9/14] w-full overflow-hidden rounded-2xl">
        <Image
          source={{
            uri: `${TMDB_POSTER_PATH}/w342//gdIrmf2DdY5mgN6ycVP0XlzKzbE.jpg`,
            width: 200,
          }}
          className="h-full w-full object-cover"
        />
      </View>
      <BoldText className="text-white">Hamilton</BoldText>
      <View className="flex-row items-center gap-3">
        <RegularText className="text-xs text-gray-600">Movie</RegularText>
        <View className="h-1 w-1 rounded-3xl bg-gray-600" />
        <RegularText className="text-sm text-gray-600">2023</RegularText>
      </View>
    </View>
  );
}
