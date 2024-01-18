import { StyleSheet, Text } from 'react-native';

import { globalStyles } from '../../styles/global';
import ScreenLayout from '../../components/layout/screenLayout';
import { RegularText } from '../../components/Styled';

export default function AccountScreen() {
  return (
    <ScreenLayout
      title="Account"
      subtitle="Manage your movie web account from here"
    >
      <RegularText style={globalStyles.textWhite}>
        Hey Bro! what are you up to?
      </RegularText>
    </ScreenLayout>
  );
}
