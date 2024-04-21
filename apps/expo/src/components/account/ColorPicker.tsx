import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { View, XStack } from "tamagui";

export const colors = [
  "#0A54FF",
  "#CF2E68",
  "#F9DD7F",
  "#7652DD",
  "#2ECFA8",
] as const;

export function ColorPicker(props: {
  value: string;
  onInput: (v: string) => void;
}) {
  return (
    <XStack gap="$2">
      {colors.map((color) => {
        return (
          <View
            onPress={() => props.onInput(color)}
            flexGrow={1}
            height="$4"
            borderRadius="$4"
            justifyContent="center"
            alignItems="center"
            backgroundColor={color}
            key={color}
          >
            {props.value === color ? (
              <Ionicons name="checkmark-circle" size={24} color="white" />
            ) : null}
          </View>
        );
      })}
    </XStack>
  );
}
