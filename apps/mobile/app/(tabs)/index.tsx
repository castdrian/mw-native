import ScreenLayout from '@/components/layout/ScreenLayout';
import { Text } from '@/components/ui/Text';

export default function HomeScreen() {
  return (
    <ScreenLayout title="Home" subtitle="This is where all magic happens">
      <Text>Movies will be listed here</Text>
    </ScreenLayout>
  );
}
