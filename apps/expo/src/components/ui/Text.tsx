import type { TextProps } from "react-native";
import type { AnimatedProps } from "react-native-reanimated";
import { useEffect } from "react";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

export const FlashingText = (
  props: AnimatedProps<TextProps> & {
    isInProgress: boolean;
  },
) => {
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (props.isInProgress) {
      opacity.value = withRepeat(
        withTiming(1, { duration: 1000, easing: Easing.ease }),
        -1,
        true,
      );
    } else {
      opacity.value = 1;
    }
  }, [props.isInProgress, opacity]);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return <Animated.Text {...props} style={[props.style, style]} />;
};
