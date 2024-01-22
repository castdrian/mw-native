import ScreenLayout from '../../components/layout/ScreenLayout';
import { RegularText } from '../../components/ui/Text';

export default function AccountScreen() {
  return (
    <ScreenLayout
      title="Account"
      subtitle="Manage your movie web account from here"
    >
      <RegularText className="text-white">
        Hey Bro! what are you up to?
      </RegularText>
    </ScreenLayout>
  );
}
