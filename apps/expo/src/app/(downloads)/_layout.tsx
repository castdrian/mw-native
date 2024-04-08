import { Stack } from "expo-router";

import { BrandPill } from "~/components/BrandPill";

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        headerTransparent: true,
        headerRight: BrandPill,
      }}
    />
  );
}
