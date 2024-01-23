import ScreenLayout from '../../components/layout/ScreenLayout';
import { StyledText } from '../../components/ui/Styled';

export default function AccountScreen() {
  return (
    <ScreenLayout
      title="Account"
      subtitle="Manage your movie web account from here"
    >
      <StyledText>Hey Bro! what are you up to?</StyledText>
    </ScreenLayout>
  );
}
