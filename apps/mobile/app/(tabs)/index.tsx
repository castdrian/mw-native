import ScreenLayout from '../../components/layout/ScreenLayout';
import { StyledText } from '../../components/ui/Styled';

export default function HomeScreen() {
  return (
    <ScreenLayout title="Home" subtitle="This is where all magic happens">
      <StyledText>Movies will be listed here</StyledText>
    </ScreenLayout>
  );
}
