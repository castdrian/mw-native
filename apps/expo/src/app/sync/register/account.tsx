import { useState } from "react";
import { Stack, useRouter } from "expo-router";
import { H4, Label, Paragraph, View, YStack } from "tamagui";

import { Avatar } from "~/components/account/Avatar";
import { ColorPicker, colors } from "~/components/account/ColorPicker";
import {
  expoIcons,
  getDbIconFromExpoIcon,
  UserIconPicker,
} from "~/components/account/UserIconPicker";
import ScreenLayout from "~/components/layout/ScreenLayout";
import { MWButton } from "~/components/ui/Button";
import { MWCard } from "~/components/ui/Card";
import { MWInput } from "~/components/ui/Input";

export default function Page() {
  const router = useRouter();

  const [deviceName, setDeviceName] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [colorA, setColorA] = useState<string>(colors[0]);
  const [colorB, setColorB] = useState<string>(colors[0]);
  const [icon, setIcon] = useState<string>(expoIcons[0]);

  const handleNext = () => {
    if (!deviceName) {
      setErrorMessage("Please enter a device name");
      return;
    }
    return router.push({
      pathname: "/sync/register/confirm",
      params: {
        deviceName,
        colorA,
        colorB,
        icon: getDbIconFromExpoIcon(icon),
      },
    });
  };

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
          <View alignItems="center" marginBottom="$3">
            <Avatar colorA={colorA} colorB={colorB} icon={icon} />
          </View>

          <H4 fontWeight="$bold" textAlign="center">
            Account information
          </H4>

          <Paragraph
            color="$shade200"
            textAlign="center"
            fontWeight="$normal"
            paddingTop="$4"
          >
            Enter a name for your device and pick colours and a user icon of
            your choosing
          </Paragraph>
        </MWCard.Header>

        <YStack paddingBottom="$5">
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
          <YStack gap="$1">
            <Label fontWeight="$bold">Profile color one</Label>
            <ColorPicker value={colorA} onInput={(color) => setColorA(color)} />
          </YStack>
          <YStack gap="$1">
            <Label fontWeight="$bold">Profile color two</Label>
            <ColorPicker value={colorB} onInput={(color) => setColorB(color)} />
          </YStack>
          <YStack gap="$1">
            <Label fontWeight="$bold">User icon</Label>
            <UserIconPicker value={icon} onInput={(icon) => setIcon(icon)} />
          </YStack>
        </YStack>

        <MWCard.Footer justifyContent="center" flexDirection="column" gap="$4">
          {errorMessage && (
            <Paragraph color="$rose200" textAlign="center">
              {errorMessage}
            </Paragraph>
          )}
          <MWButton type="purple" width="100%" onPress={handleNext}>
            Next
          </MWButton>
        </MWCard.Footer>
      </MWCard>
    </ScreenLayout>
  );
}
