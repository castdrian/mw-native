import { Button, Dialog, View } from "tamagui";

import { Controls } from "./Controls";

interface PlayerModalProps {
  button: {
    icon: JSX.Element;
    title: string;
  };
  children?: React.ReactNode;
}

export function PlayerModal(props: PlayerModalProps) {
  return (
    <View flex={1} maxWidth={144}>
      <Dialog modal>
        <Dialog.Trigger asChild>
          <Controls>
            <Button icon={props.button.icon}>{props.button.title}</Button>
          </Controls>
        </Dialog.Trigger>

        <Dialog.Portal>
          <Dialog.Overlay
            key="overlay"
            animation="slow"
            opacity={0.5}
            enterStyle={{ opacity: 0 }}
            exitStyle={{ opacity: 0 }}
          />
          <Dialog.Content
            bordered
            elevate
            key="content"
            animateOnly={["transform", "opacity"]}
            animation={[
              "quicker",
              {
                opacity: {
                  overshootClamping: true,
                },
              },
            ]}
            enterStyle={{ x: 0, y: -20, opacity: 0, scale: 0.9 }}
            exitStyle={{ x: 0, y: 10, opacity: 0, scale: 0.95 }}
            gap="$4"
          >
            {props.children}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog>
    </View>
  );
}
