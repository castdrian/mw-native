import { Dimensions, StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    minHeight: Dimensions.get('window').height,
  },
  children: {
    paddingVertical: 12,
  },
});
