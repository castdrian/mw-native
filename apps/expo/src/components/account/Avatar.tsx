import type { CircleProps } from "tamagui";
import { FontAwesome6 } from "@expo/vector-icons";
import { Circle } from "tamagui";
import { LinearGradient } from "tamagui/linear-gradient";

import type { expoIcons } from "./UserIconPicker";

export interface AvatarProps {
  colorA: string;
  colorB: string;
  icon: (typeof expoIcons)[number];
}

export function Avatar(props: AvatarProps & CircleProps) {
  return (
    <Circle
      backgroundColor={props.colorA}
      height="$6"
      width="$6"
      justifyContent="center"
      alignItems="center"
      {...props}
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
