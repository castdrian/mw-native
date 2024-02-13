import type { TouchableOpacity } from "react-native";
import React from "react";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";

import { usePlayerStore } from "~/stores/player/store";

interface ControlsProps extends React.ComponentProps<typeof TouchableOpacity> {
  children: React.ReactNode;
}

export const Controls = ({ children, className }: ControlsProps) => {
  const idle = usePlayerStore((state) => state.interface.isIdle);
  const setIsIdle = usePlayerStore((state) => state.setIsIdle);

  return (
    <TouchableWithoutFeedback
      className={className}
      onPress={() => setIsIdle(false)}
    >
      {!idle && children}
    </TouchableWithoutFeedback>
  );
};
