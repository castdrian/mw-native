import type { TouchableOpacity } from "react-native";
import React from "react";
import { View } from "react-native";

import { usePlayerStore } from "~/stores/player/store";

interface ControlsProps extends React.ComponentProps<typeof TouchableOpacity> {
  children: React.ReactNode;
}

export const Controls = ({ children }: ControlsProps) => {
  const idle = usePlayerStore((state) => state.interface.isIdle);
  return <View>{!idle && children}</View>;
};
