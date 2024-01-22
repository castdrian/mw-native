import { Link, Stack } from 'expo-router';
import { View } from 'react-native';

import { BoldText, RegularText } from '../components/ui/Text';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <View className="flex-1 items-center justify-center p-5">
        <BoldText className="text-lg font-bold">
          This screen doesn&apos;t exist.
        </BoldText>

        <Link href="/" className="mt-4 py-4">
          <RegularText className="text-sm text-sky-500">
            Go to home screen!
          </RegularText>
        </Link>
      </View>
    </>
  );
}
