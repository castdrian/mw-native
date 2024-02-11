import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { usePlayer } from "~/context/player.context";

export const BackButton = ({
  className,
}: Partial<React.ComponentProps<typeof Ionicons>>) => {
  const { unlockOrientation } = usePlayer();
  const router = useRouter();

  return (
    <Ionicons
      name="arrow-back"
      onPress={() => {
        unlockOrientation()
          .then(() => {
            return router.back();
          })
          .catch(() => {
            return router.back();
          });
      }}
      size={36}
      color="white"
      className={className}
    />
  );
};
