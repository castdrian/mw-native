import { Keyboard } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { usePlayer } from "~/hooks/player/usePlayer";

export const BackButton = ({
  className,
}: Partial<React.ComponentProps<typeof Ionicons>>) => {
  const { dismissFullscreenPlayer } = usePlayer();
  const router = useRouter();

  return (
    <Ionicons
      name="arrow-back"
      onPress={() => {
        dismissFullscreenPlayer()
          .then(() => {
            router.back();
            return setTimeout(() => {
              Keyboard.dismiss();
            }, 100);
          })
          .catch(() => {
            router.back();
            return setTimeout(() => {
              Keyboard.dismiss();
            }, 100);
          });
      }}
      size={36}
      color="white"
      className={className}
    />
  );
};
