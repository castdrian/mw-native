import { Image } from 'react-native';

import { TMDB_POSTER_PATH } from '../../constants/General';
import { StyledText, StyledView } from '../ui/Styled';

export default function Item() {
  return (
    <StyledView className="w-full">
      <StyledView className="mb-2 aspect-[9/14] w-full overflow-hidden rounded-2xl">
        <Image
          source={{
            uri: `${TMDB_POSTER_PATH}/w342//gdIrmf2DdY5mgN6ycVP0XlzKzbE.jpg`,
            width: 200,
          }}
          className="h-full w-full object-cover"
        />
      </StyledView>
      <StyledText className="font-bold text-white">Hamilton</StyledText>
      <StyledView className="flex-row items-center gap-3">
        <StyledText className="text-xs text-gray-600">Movie</StyledText>
        <StyledView className="h-1 w-1 rounded-3xl bg-gray-600" />
        <StyledText className="text-sm text-gray-600">2023</StyledText>
      </StyledView>
    </StyledView>
  );
}
