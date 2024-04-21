import type { CircleProps } from "tamagui";
import { FontAwesome6 } from "@expo/vector-icons";
import { Circle, View } from "tamagui";
import { LinearGradient } from "tamagui/linear-gradient";

export interface AvatarProps {
  colorA: string;
  colorB: string;
  icon: string;
  bottomItem?: React.ReactNode;
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
      <View position="absolute" bottom={0}>
        {props.bottomItem}
      </View>
    </Circle>
  );
}
