import { useState } from "react";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useMutation } from "@tanstack/react-query";
import { H4, Label, Paragraph, YStack } from "tamagui";

import ScreenLayout from "~/components/layout/ScreenLayout";
import { MWButton } from "~/components/ui/Button";
import { MWCard } from "~/components/ui/Card";
import { MWInput } from "~/components/ui/Input";
import { useAuth } from "~/hooks/useAuth";

export default function Page() {
  const router = useRouter();
  // Requires type casting, typecheck fails for type-safe params
  const { deviceName, colorA, colorB, icon } =
    useLocalSearchParams() as unknown as {
      deviceName: string;
      colorA: string;
      colorB: string;
      icon: string;
    };
  const { register } = useAuth();

  const [passphrase, setPassphrase] = useState("");

  const mutation = useMutation({
    mutationKey: ["register", deviceName, colorA, colorB, icon],
    mutationFn: () =>
      register({
        // TODO: "Add recaptchaToken",
        mnemonic: passphrase,
        userData: {
          device: deviceName,
          profile: { colorA, colorB, icon },
        },
      }),
    onSuccess: (data) => {
      if (data) {
        return router.push("/(tabs)/movie-web");
      }
      return null;
    },
  });

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
              value={passphrase}
              onChangeText={setPassphrase}
            />
          </YStack>
        </YStack>

        <MWCard.Footer justifyContent="center" flexDirection="column" gap="$4">
          {mutation.isError && (
            <Paragraph color="$rose200" textAlign="center">
              {mutation.error.message}
            </Paragraph>
          )}

          <MWButton
            type="purple"
            onPress={() => mutation.mutate()}
            isLoading={mutation.isPending}
          >
            Create account
          </MWButton>
        </MWCard.Footer>
      </MWCard>
    </ScreenLayout>
  );
}
