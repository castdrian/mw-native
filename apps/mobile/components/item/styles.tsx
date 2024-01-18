import Colors from '../../constants/Colors';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
  },
  imageWrapper: {
    borderRadius: 16,
    aspectRatio: 9 / 14,
    width: '100%',
    overflow: 'hidden',
    position: 'relative',
    marginBottom: 6,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  meta: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
  },
  smallText: {
    fontSize: 12,
  },
});

export default styles;
