import ScreenLayout from '../../components/layout/ScreenLayout';
import { RegularText } from '../../components/ui/Text';

export default function SettingsScreen() {
  return (
    <ScreenLayout title="Settings" subtitle="Need to change something?">
      <RegularText className="text-white">
        Settings would be listed in here. Coming soon
      </RegularText>
    </ScreenLayout>
  );
}
