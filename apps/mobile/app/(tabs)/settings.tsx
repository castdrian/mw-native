import { RegularText } from '../../components/Styled';
import ScreenLayout from '../../components/layout/screenLayout';
import { globalStyles } from '../../styles/global';
import { StyleSheet, Text } from 'react-native';

export default function SettingsScreen() {
  return (
    <ScreenLayout title="Settings" subtitle="Need to change something?">
      <RegularText style={globalStyles.textWhite}>
        Settings would be listed in here. Coming soon
      </RegularText>
    </ScreenLayout>
  );
}
