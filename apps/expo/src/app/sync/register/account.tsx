import { useState } from "react";
import { Link, Stack } from "expo-router";
import { FontAwesome6, Ionicons } from "@expo/vector-icons";
import { Circle, H4, Label, Paragraph, View, XStack, YStack } from "tamagui";
import { LinearGradient } from "tamagui/linear-gradient";

import ScreenLayout from "~/components/layout/ScreenLayout";
import { MWButton } from "~/components/ui/Button";
import { MWCard } from "~/components/ui/Card";
import { MWInput } from "~/components/ui/Input";

const colors = ["#0A54FF", "#CF2E68", "#F9DD7F", "#7652DD", "#2ECFA8"] as const;

function ColorPicker(props: {
  value: (typeof colors)[number];
  onInput: (v: (typeof colors)[number]) => void;
}) {
  return (
    <XStack gap="$2">
      {colors.map((color) => {
        return (
          <View
            onPress={() => props.onInput(color)}
            flexGrow={1}
            height="$4"
            borderRadius="$4"
            justifyContent="center"
            alignItems="center"
            backgroundColor={color}
            key={color}
          >
            {props.value === color ? (
              <Ionicons name="checkmark-circle" size={24} color="white" />
            ) : null}
          </View>
        );
      })}
    </XStack>
  );
}

const icons = [
  "user-group",
  "couch",
  "mobile-screen",
  "ticket",
  "handcuffs",
] as const;

function UserIconPicker(props: {
  value: (typeof icons)[number];
  onInput: (v: (typeof icons)[number]) => void;
}) {
  return (
    <XStack gap="$2">
      {icons.map((icon) => {
        return (
          <View
            flexGrow={1}
            height="$4"
            borderRadius="$4"
            justifyContent="center"
            alignItems="center"
            backgroundColor={props.value === icon ? "$purple400" : "$shade400"}
            borderColor={props.value === icon ? "$purple200" : "$shade400"}
            borderWidth={1}
            key={icon}
            onPress={() => props.onInput(icon)}
          >
            <FontAwesome6 name={icon} size={24} color="white" />
          </View>
        );
      })}
    </XStack>
  );
}

interface AvatarProps {
  colorA: string;
  colorB: string;
  icon: (typeof icons)[number];
}

export function Avatar(props: AvatarProps) {
  return (
    <Circle
      backgroundColor={props.colorA}
      height="$6"
      width="$6"
      justifyContent="center"
      alignItems="center"
    >
      <LinearGradient
        colors={[props.colorA, props.colorB]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        borderRadius="$12"
        width="100%"
        height="100%"
        justifyContent="center"
        alignItems="center"
      >
        <FontAwesome6 name={props.icon} size={24} color="white" />
      </LinearGradient>
    </Circle>
  );
}

export default function Page() {
  const [color, setColor] = useState<(typeof colors)[number]>(colors[0]);
  const [color2, setColor2] = useState<(typeof colors)[number]>(colors[0]);
  const [icon, setIcon] = useState<(typeof icons)[number]>(icons[0]);

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
            <Avatar colorA={color} colorB={color2} icon={icon} />
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
              placeholder="Passphrase"
              secureTextEntry
              autoCorrect={false}
            />
          </YStack>
          <YStack gap="$1">
            <Label fontWeight="$bold">Profile color one</Label>
            <ColorPicker value={color} onInput={(color) => setColor(color)} />
          </YStack>
          <YStack gap="$1">
            <Label fontWeight="$bold">Profile color two</Label>
            <ColorPicker value={color2} onInput={(color) => setColor2(color)} />
          </YStack>
          <YStack gap="$1">
            <Label fontWeight="$bold">User icon</Label>
            <UserIconPicker value={icon} onInput={(icon) => setIcon(icon)} />
          </YStack>
        </YStack>

        <MWCard.Footer justifyContent="center" flexDirection="column" gap="$4">
          <Link
            href={{
              pathname: "/sync/register/confirm",
            }}
            replace
            asChild
          >
            <MWButton type="purple" width="100%">
              Next
            </MWButton>
          </Link>
        </MWCard.Footer>
      </MWCard>
    </ScreenLayout>
  );
}
