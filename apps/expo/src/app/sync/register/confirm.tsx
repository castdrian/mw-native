import { Link, Stack } from "expo-router";
import { H4, Label, Paragraph, YStack } from "tamagui";

import ScreenLayout from "~/components/layout/ScreenLayout";
import { MWButton } from "~/components/ui/Button";
import { MWCard } from "~/components/ui/Card";
import { MWInput } from "~/components/ui/Input";

export default function Page() {
  return (
    <ScreenLayout
      showHeader={false}
      contentContainerStyle={{
        flexGrow: 1,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Stack.Screen
        options={{
          title: "",
        }}
      />

      <MWCard bordered padded>
        <MWCard.Header>
          <H4 fontWeight="$bold" textAlign="center">
            Confirm your passphrase
          </H4>

          <Paragraph
            color="$shade200"
            textAlign="center"
            fontWeight="$normal"
            paddingTop="$4"
          >
            Please enter your passphrase from earlier to confirm you have saved
            it and to create your account
          </Paragraph>
        </MWCard.Header>

        <YStack paddingBottom="$5">
          <YStack gap="$1">
            <Label fontWeight="$bold">12-Word passphrase</Label>
            <MWInput
              type="authentication"
              placeholder="Passphrase"
              secureTextEntry
              autoCorrect={false}
            />
          </YStack>
        </YStack>

        <MWCard.Footer justifyContent="center" flexDirection="column" gap="$4">
          <Link
            href={{
              pathname: "/(tabs)/movie-web",
            }}
            replace
            asChild
          >
            <MWButton type="purple">Create account</MWButton>
          </Link>
        </MWCard.Footer>
      </MWCard>
    </ScreenLayout>
  );
}
