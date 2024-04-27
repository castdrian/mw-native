import { H3, Sheet, Text, XStack, YStack } from "tamagui";

import { MWButton } from "../ui/Button";
import { Avatar } from "./Avatar";
import { ColorPicker } from "./ColorPicker";
import { UserIconPicker } from "./UserIconPicker";

export function ChangeProfileModal(props: {
  colorA: string;
  setColorA: (s: string) => void;
  colorB: string;
  setColorB: (s: string) => void;
  icon: string;
  setUserIcon: (s: string) => void;

  open: boolean;
  setOpen: (b: boolean) => void;
}) {
  return (
    <Sheet
      forceRemoveScrollEnabled={props.open}
      modal
      open={props.open}
      onOpenChange={props.setOpen}
      dismissOnSnapToBottom
      dismissOnOverlayPress
      animation="fast"
      snapPoints={[65]}
    >
      <Sheet.Handle backgroundColor="$shade100" />
      <Sheet.Frame
        backgroundColor="$shade800"
        padding="$4"
        alignItems="center"
        justifyContent="center"
      >
        <YStack padding="$4" gap="$4">
          <XStack gap="$4" alignItems="center">
            <H3 flexGrow={1} fontWeight="$bold">
              Edit profile picture
            </H3>
            <Avatar
              colorA={props.colorA}
              colorB={props.colorB}
              icon={props.icon}
            />
          </XStack>

          <YStack gap="$2">
            <Text fontWeight="$bold">Profile color one</Text>
            <ColorPicker value={props.colorA} onInput={props.setColorA} />
          </YStack>

          <YStack gap="$2">
            <Text fontWeight="$bold">Profile color two</Text>
            <ColorPicker value={props.colorB} onInput={props.setColorB} />
          </YStack>

          <YStack gap="$2">
            <Text fontWeight="$bold">User icon</Text>
            <UserIconPicker value={props.icon} onInput={props.setUserIcon} />
          </YStack>
        </YStack>

        <MWButton
          type="purple"
          width="100%"
          onPress={() => props.setOpen(false)}
        >
          Finish editing
        </MWButton>
      </Sheet.Frame>
      <Sheet.Overlay
        animation="lazy"
        backgroundColor="rgba(0, 0, 0, 0.8)"
        enterStyle={{ opacity: 0 }}
        exitStyle={{ opacity: 0 }}
      />
    </Sheet>
  );
}
