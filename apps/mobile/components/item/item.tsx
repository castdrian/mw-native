import { globalStyles } from '../../styles/global';
import { Image, Text, View } from 'react-native';
import styles from './styles';
import { BoldText, RegularText } from '../Styled';

export default function Item() {
  return (
    <View style={styles.wrapper}>
      <View style={styles.imageWrapper}>
        <Image
          source={{
            uri: 'https://image.tmdb.org/t/p/w342//gdIrmf2DdY5mgN6ycVP0XlzKzbE.jpg',
            width: 200,
          }}
          style={styles.image}
        />
      </View>
      <BoldText style={globalStyles.textWhite}>Hamilton</BoldText>
      <View style={styles.meta}>
        <RegularText style={[globalStyles.textMuted, styles.smallText]}>
          Movie
        </RegularText>
        <View style={[globalStyles.dotSeperator]}></View>
        <RegularText style={[globalStyles.textMuted, styles.smallText]}>
          2023
        </RegularText>
      </View>
    </View>
  );
}
