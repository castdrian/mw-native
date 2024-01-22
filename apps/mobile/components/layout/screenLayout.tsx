import { View } from 'react-native';

import { BoldText, RegularText } from '../ui/Text';

type Props = {
  title?: React.ReactNode | string;
  subtitle?: string;
  children?: React.ReactNode;
};

export default function ScreenLayout({ title, subtitle, children }: Props) {
  return (
    <View className="bg-shade-900 flex-1 py-12">
      {typeof title === 'string' && (
        <BoldText className="text-2xl font-bold text-white">{title}</BoldText>
      )}
      {typeof title !== 'string' && title}
      <RegularText className="text-shade-200 mt-1 text-sm">
        {subtitle}
      </RegularText>
      <View className="py-3">{children}</View>
    </View>
  );
}
