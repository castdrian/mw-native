import { FontAwesome } from "@expo/vector-icons";

import { defaultTheme } from "@movie-web/tailwind-config/themes";

type Props = {
  focused?: boolean;
} & React.ComponentProps<typeof FontAwesome>;

export default function TabBarIcon({ focused, ...rest }: Props) {
  const color = focused
    ? defaultTheme.extend.colors.tabBar.active
    : defaultTheme.extend.colors.tabBar.inactive;
  return <FontAwesome color={color} size={24} {...rest} />;
}
