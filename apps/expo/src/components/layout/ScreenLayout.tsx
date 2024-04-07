import { ScrollView } from "tamagui";
import { LinearGradient } from "tamagui/linear-gradient";

import { Header } from "./Header";

interface Props {
  children?: React.ReactNode;
  onScrollBeginDrag?: () => void;
  onMomentumScrollEnd?: () => void;
  scrollEnabled?: boolean;
  keyboardDismissMode?: "none" | "on-drag" | "interactive";
  keyboardShouldPersistTaps?: "always" | "never" | "handled";
  contentContainerStyle?: Record<string, unknown>;
}

export default function ScreenLayout({
  children,
  onScrollBeginDrag,
  onMomentumScrollEnd,
  scrollEnabled,
  keyboardDismissMode,
  keyboardShouldPersistTaps,
  contentContainerStyle,
}: Props) {
  return (
    <LinearGradient
      flex={1}
      paddingVertical="$4"
      paddingHorizontal="$4"
      colors={[
        "$shade900",
        "$purple900",
        "$purple800",
        "$shade700",
        "$shade900",
      ]}
      locations={[0.02, 0.15, 0.2, 0.4, 0.8]}
      start={[0, 0]}
      end={[1, 1]}
      flexGrow={1}
    >
      <Header />
      <ScrollView
        onScrollBeginDrag={onScrollBeginDrag}
        onMomentumScrollEnd={onMomentumScrollEnd}
        scrollEnabled={scrollEnabled}
        keyboardDismissMode={keyboardDismissMode}
        keyboardShouldPersistTaps={keyboardShouldPersistTaps}
        contentContainerStyle={contentContainerStyle}
        marginTop="$4"
        flexGrow={1}
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>
    </LinearGradient>
  );
}
