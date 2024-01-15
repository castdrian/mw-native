import { StyleSheet, Text, View } from 'react-native';

export default function TabBar() {
  return (
    <View style={styles.wrapper}>
      <Text>First Tab</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: '#131322',
    paddingVertical: 24,
    paddingHorizontal: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
