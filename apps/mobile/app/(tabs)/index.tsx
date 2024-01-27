import { Text } from 'react-native';

import ScreenLayout from '../../components/layout/ScreenLayout';

export default function HomeScreen() {
  return (
    <ScreenLayout title="Home" subtitle="This is where all magic happens">
      <Text>Movies will be listed here</Text>
    </ScreenLayout>
  );
}
