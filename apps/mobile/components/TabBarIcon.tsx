import { FontAwesome } from '@expo/vector-icons';

import useTailwind from '../app/hooks/useTailwind';

type Props = {
  focused?: boolean;
} & React.ComponentProps<typeof FontAwesome>;

export default function TabBarIcon({ focused, ...rest }: Props) {
  const { colors } = useTailwind();
  return (
    <FontAwesome
      color={focused ? colors.purple[300] : colors.shade[300]}
      size={24}
      {...rest}
    />
  );
}
