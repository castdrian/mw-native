import { View } from "react-native";

import { usePlayerStore } from "~/stores/player/store";

interface ControlsProps {
  children: React.ReactNode;
}

export const Controls = ({ children }: ControlsProps) => {
  const idle = usePlayerStore((state) => state.interface.isIdle);

  return <View className="flex-1 items-center">{!idle && children}</View>;
};
