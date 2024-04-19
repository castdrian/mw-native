import { Stack } from "expo-router";
import { H4, Label, Paragraph, Text, YStack } from "tamagui";

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
            Login to your account
          </H4>

          <Paragraph
            color="$ash50"
            textAlign="center"
            fontWeight="$semibold"
            paddingVertical="$4"
          >
            Please enter your passphrase to login to your account
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
          <YStack gap="$1">
            <Label fontWeight="$bold">Device name</Label>
            <MWInput
              type="authentication"
              placeholder="Personal phone"
              autoCorrect={false}
            />
          </YStack>
        </YStack>

        <MWCard.Footer
          padded
          justifyContent="center"
          flexDirection="column"
          gap="$4"
        >
          <MWButton type="purple">Login</MWButton>

          <Paragraph color="$ash50" textAlign="center" fontWeight="$semibold">
            Don&apos;t have an account yet?{"\n"}
            <Text color="$purple100" fontWeight="$bold">
              Create an account.
            </Text>
          </Paragraph>
        </MWCard.Footer>
      </MWCard>
    </ScreenLayout>
  );
}
