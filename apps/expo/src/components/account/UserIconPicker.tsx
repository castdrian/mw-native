import React from "react";
import { FontAwesome6 } from "@expo/vector-icons";
import { View, XStack } from "tamagui";

export const expoIcons = [
  "user-group",
  "couch",
  "mobile-screen",
  "ticket",
  "handcuffs",
] as const;

export const expoIconsToDbIcons: Record<(typeof expoIcons)[number], string> = {
  "user-group": "userGroup",
  couch: "couch",
  "mobile-screen": "mobile",
  ticket: "ticket",
  handcuffs: "handcuffs",
};

export const getExpoIconFromDbIcon = (icon: string) => {
  return Object.keys(expoIconsToDbIcons).find(
    (key) => expoIconsToDbIcons[key as (typeof expoIcons)[number]] === icon,
  ) as (typeof expoIcons)[number];
};

export const getDbIconFromExpoIcon = (icon: string) => {
  return expoIconsToDbIcons[icon as (typeof expoIcons)[number]];
};

export function UserIconPicker(props: {
  value: string;
  onInput: (v: string) => void;
}) {
  return (
    <XStack gap="$2">
      {expoIcons.map((icon) => {
        return (
          <View
            flexGrow={1}
            height="$4"
            borderRadius="$4"
            justifyContent="center"
            alignItems="center"
            backgroundColor={props.value === icon ? "$purple400" : "$shade400"}
            borderColor={props.value === icon ? "$purple200" : "$shade400"}
            borderWidth={1}
            key={icon}
            onPress={() => props.onInput(icon)}
          >
            <FontAwesome6 name={icon} size={24} color="white" />
          </View>
        );
      })}
    </XStack>
  );
}
