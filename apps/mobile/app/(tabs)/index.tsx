import ScreenLayout from '../../components/layout/ScreenLayout';
import { RegularText } from '../../components/ui/Text';

export default function HomeScreen() {
  return (
    <ScreenLayout title="Home" subtitle="This is where all magic happens">
      <RegularText className="text-white">
        Movies will be listed here
      </RegularText>
    </ScreenLayout>
  );
}
