import { FontAwesome } from '@expo/vector-icons';
import Colors from '../constants/Colors';

type Props = {
  focused?: boolean;
  color?: string;
} & React.ComponentProps<typeof FontAwesome>;

export default function TabBarIcon({
  color = Colors.dark.shade300,
  focused,
  ...rest
}: Props) {
  return (
    <FontAwesome
      color={color || (focused ? Colors.dark.purple300 : Colors.dark.shade300)}
      size={24}
      {...rest}
    />
  );
}
