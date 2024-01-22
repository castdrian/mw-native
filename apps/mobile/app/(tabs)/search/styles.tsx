import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  items: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    width: '100%',
    flexDirection: 'row',
    flex: 1,
  },
  itemOuter: {
    flexBasis: '50%',
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
});

export default styles;
