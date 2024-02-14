import type {
  HandlerStateChangeEvent,
  PanGestureHandlerGestureEvent,
  TapGestureHandlerEventPayload,
} from "react-native-gesture-handler";
import React, { useEffect, useRef } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import {
  PanGestureHandler,
  State,
  TapGestureHandler,
} from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";

import colors from "@movie-web/tailwind-config/colors";

import { usePlayerStore } from "~/stores/player/store";

const clamp = (value: number, lowerBound: number, upperBound: number) => {
  "worklet";
  return Math.min(Math.max(lowerBound, value), upperBound);
};

interface VideoSliderProps {
  onSlidingComplete?: (value: number) => void;
}

const VideoSlider = ({ onSlidingComplete }: VideoSliderProps) => {
  const status = usePlayerStore((state) => state.status);

  const width = Dimensions.get("screen").width - 140;
  const knobSize_ = 20;
  const trackSize_ = 8;
  const minimumValue = 0;
  const maximumValue = status?.isLoaded ? status.durationMillis! : 0;
  const value = status?.isLoaded ? status.positionMillis : 0;

  const valueToX = (v: number) => {
    if (maximumValue === minimumValue) return 0;
    return (width * (v - minimumValue)) / (maximumValue - minimumValue);
  };
  const xToValue = (x: number) => {
    "worklet";
    if (maximumValue === minimumValue) return minimumValue;
    return (x / width) * (maximumValue - minimumValue) + minimumValue;
  };
  const valueX = valueToX(value);
  const translateX = useSharedValue(valueToX(value));

  const tapRef = useRef<TapGestureHandler>(null);
  const panRef = useRef<PanGestureHandler>(null);

  useEffect(() => {
    translateX.value = clamp(valueX, 0, width - knobSize_);
  }, [valueX]);

  const _onSlidingComplete = (xValue: number) => {
    "worklet";
    if (onSlidingComplete) runOnJS(onSlidingComplete)(xToValue(xValue));
  };

  const _onActive = (value: number) => {
    "worklet";
    translateX.value = clamp(value, 0, width - knobSize_);
  };

  const onGestureEvent = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    { offsetX: number }
  >({
    onStart: (_, ctx) => (ctx.offsetX = translateX.value),
    onActive: (event, ctx) => _onActive(event.translationX + ctx.offsetX),
  });

  const onTapEvent = (
    event: HandlerStateChangeEvent<TapGestureHandlerEventPayload>,
  ) => {
    if (event.nativeEvent.state === State.ACTIVE) {
      _onActive(event.nativeEvent.x);
      _onSlidingComplete(event.nativeEvent.x);
    }
  };

  const scrollTranslationStyle = useAnimatedStyle(() => {
    return { transform: [{ translateX: translateX.value }] };
  });

  const progressStyle = useAnimatedStyle(() => {
    return {
      width: translateX.value + knobSize_,
    };
  });

  return (
    <TapGestureHandler
      ref={tapRef}
      onHandlerStateChange={onTapEvent}
      simultaneousHandlers={panRef}
    >
      <View
        style={[
          {
            alignItems: "center",
            justifyContent: "center",
            height: knobSize_,
            width,
          },
        ]}
      >
        <View
          className="justify-center"
          style={[
            {
              height: trackSize_,
              borderRadius: trackSize_,
              backgroundColor: colors.secondary[700],
              width,
            },
          ]}
        >
          <Animated.View
            className="absolute bottom-0 left-0 right-0 top-0"
            style={[
              {
                backgroundColor: colors.primary[300],
                borderRadius: trackSize_ / 2,
              },
              progressStyle,
            ]}
          />
          <PanGestureHandler
            ref={panRef}
            onGestureEvent={onGestureEvent}
            simultaneousHandlers={tapRef}
          >
            <Animated.View
              style={[
                styles.knob,
                {
                  height: knobSize_,
                  width: knobSize_,
                  borderRadius: knobSize_ / 2,
                  backgroundColor: colors.primary[300],
                },
                scrollTranslationStyle,
              ]}
            />
          </PanGestureHandler>
        </View>
      </View>
    </TapGestureHandler>
  );
};

const styles = StyleSheet.create({
  knob: {
    justifyContent: "center",
    alignItems: "center",
  },
});

export default VideoSlider;
