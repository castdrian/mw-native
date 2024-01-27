import { Text } from 'react-native';

import ScreenLayout from '../../components/layout/ScreenLayout';

export default function AccountScreen() {
  return (
    <ScreenLayout
      title="Account"
      subtitle="Manage your movie web account from here"
    >
      <Text>Hey Bro! what are you up to?</Text>
    </ScreenLayout>
  );
}
