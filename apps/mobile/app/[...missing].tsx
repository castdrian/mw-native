import { Link, Stack } from 'expo-router';

import { StyledText, StyledView } from '../components/ui/Styled';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <StyledView className="flex-1 items-center justify-center p-5">
        <StyledText className="text-lg font-bold">
          This screen doesn&apos;t exist.
        </StyledText>

        <Link href="/" className="mt-4 py-4">
          <StyledText className="text-sm text-sky-500">
            Go to home screen!
          </StyledText>
        </Link>
      </StyledView>
    </>
  );
}
