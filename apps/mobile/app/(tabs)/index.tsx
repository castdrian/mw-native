import { RegularText } from '../../components/Styled';
import ScreenLayout from '../../components/layout/screenLayout';
import { globalStyles } from '../../styles/global';

export default function HomeScreen() {
  return (
    <ScreenLayout title="Home" subtitle="This is where all magic happens">
      <RegularText style={globalStyles.textWhite}>
        Movies will be listed here
      </RegularText>
    </ScreenLayout>
  );
}
