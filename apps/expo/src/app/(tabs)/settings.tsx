import React, { useState } from "react";
import { Text, View } from "react-native";
import { Switch } from "react-native-paper";

import ScreenLayout from "~/components/layout/ScreenLayout";

export default function SettingsScreen() {
  const [isSwitchOn, setIsSwitchOn] = useState(true);
  const onToggleSwitch = () => setIsSwitchOn(!isSwitchOn);

  return (
    <ScreenLayout title="Settings">
      <View className="p-4">
        <Text className="mb-4 text-lg font-bold text-gray-300">Player</Text>
        <View className="flex-row items-center justify-between rounded-lg border border-gray-300 px-4 py-2">
          <Text className="text-md text-gray-300">Gesture Controls</Text>
          <Switch value={isSwitchOn} onValueChange={onToggleSwitch} />
        </View>
      </View>
    </ScreenLayout>
  );
}
