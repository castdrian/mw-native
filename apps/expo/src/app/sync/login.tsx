import { useState } from "react";
import { Link, Stack, useRouter } from "expo-router";
import { useMutation } from "@tanstack/react-query";
import { H4, Label, Paragraph, Text, YStack } from "tamagui";

import ScreenLayout from "~/components/layout/ScreenLayout";
import { MWButton } from "~/components/ui/Button";
import { MWCard } from "~/components/ui/Card";
import { MWInput } from "~/components/ui/Input";
import { useAuth } from "~/hooks/useAuth";
import { useAuthStore } from "~/stores/settings";

export default function Page() {
  const backendUrl = useAuthStore((state) => state.backendUrl);
  const router = useRouter();
  const { login } = useAuth();

  const [passphrase, setPassphrase] = useState("");
  const [deviceName, setDeviceName] = useState("");

  const mutation = useMutation({
    mutationKey: ["login", backendUrl, passphrase, deviceName],
    mutationFn: () =>
      login({
        mnemonic: passphrase,
        userData: {
          device: deviceName,
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
              value={passphrase}
              onChangeText={setPassphrase}
            />
          </YStack>
          <YStack gap="$1">
            <Label fontWeight="$bold">Device name</Label>
            <MWInput
              type="authentication"
              placeholder="Personal phone"
              autoCorrect={false}
              value={deviceName}
              onChangeText={setDeviceName}
            />
          </YStack>
        </YStack>

        <MWCard.Footer
          padded
          justifyContent="center"
          flexDirection="column"
          gap="$4"
        >
          <MWButton
            type="purple"
            onPress={() => mutation.mutate()}
            isLoading={mutation.isPending}
          >
            Login
          </MWButton>
          {mutation.isError && (
            <Text color="$rose200" textAlign="center">
              {mutation.error.message}
            </Text>
          )}

          <Paragraph color="$ash50" textAlign="center" fontWeight="$semibold">
            Don&apos;t have an account yet?{"\n"}
            <Link href={{ pathname: "/sync/register" }} asChild>
              <Text color="$purple100" fontWeight="$bold">
                Create an account.
              </Text>
            </Link>
          </Paragraph>
        </MWCard.Footer>
      </MWCard>
    </ScreenLayout>
  );
}
