import React from "react";
import { TouchableOpacity } from "react-native";

import { usePlayerStore } from "~/stores/player/store";

interface ControlsProps extends React.ComponentProps<typeof TouchableOpacity> {
  children: React.ReactNode;
}

export const Controls = ({ children, className }: ControlsProps) => {
  const idle = usePlayerStore((state) => state.interface.isIdle);
  const setIsIdle = usePlayerStore((state) => state.setIsIdle);

  return (
    <TouchableOpacity
      onPress={() => {
        setIsIdle(false);
      }}
      className={className}
    >
      {!idle && children}
    </TouchableOpacity>
  );
};
