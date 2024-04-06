import { ScrollView } from "tamagui";
import { LinearGradient } from "tamagui/linear-gradient";

import { Header } from "./Header";

interface Props {
  children?: React.ReactNode;
}

export default function ScreenLayout({ children }: Props) {
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
        marginTop="$4"
        flexGrow={1}
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>
    </LinearGradient>
  );
}
