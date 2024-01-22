import { FontAwesome } from '@expo/vector-icons';

import Colors from '../constants/Colors.js';

type Props = {
  focused?: boolean;
  color?: string;
} & React.ComponentProps<typeof FontAwesome>;

export default function TabBarIcon({
  color = Colors.shade[300],
  focused,
  ...rest
}: Props) {
  return (
    <FontAwesome
      color={color || (focused ? Colors.purple[300] : Colors.shade[300])}
      size={24}
      {...rest}
    />
  );
}
