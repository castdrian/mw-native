import { FontAwesome } from '@expo/vector-icons';
import Colors from '../constants/Colors';

type Props = {
  focused?: boolean;
} & React.ComponentProps<typeof FontAwesome>;

export default function TabBarIcon({ focused, ...rest }: Props) {
  return (
    <FontAwesome
      color={focused ? Colors.primary[300] : Colors.secondary[300]}
      size={24}
      {...rest}
    />
  );
}
