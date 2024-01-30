import { View } from 'react-native';

import { Text } from '@/components/ui/Text';

type Props = {
  title?: React.ReactNode | string;
  subtitle?: string;
  children?: React.ReactNode;
};

export default function ScreenLayout({ title, subtitle, children }: Props) {
  return (
    <View className="bg-shade-900 flex-1 p-12">
      {typeof title === 'string' && (
        <Text className="text-2xl font-bold">{title}</Text>
      )}
      {typeof title !== 'string' && title}
      <Text className="mt-1 text-sm font-bold">{subtitle}</Text>
      <View className="py-3">{children}</View>
    </View>
  );
}
