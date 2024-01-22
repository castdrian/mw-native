import { View } from 'react-native';
import { globalStyles } from '../../styles/global';
import { styles } from './styles';
import { BoldText, RegularText } from '../Styled';

type Props = {
  title?: React.ReactNode | string;
  subtitle?: string;
  children?: React.ReactNode;
};

export default function ScreenLayout({ title, subtitle, children }: Props) {
  return (
    <View
      style={[
        globalStyles.pageContainer,
        globalStyles.container,
        styles.container,
      ]}
    >
      {typeof title === 'string' && (
        <BoldText style={globalStyles.sectionTitle}>{title}</BoldText>
      )}
      {typeof title !== 'string' && title}
      <RegularText style={[{ marginTop: 4 }, globalStyles.sectionSubtitle]}>
        {subtitle}
      </RegularText>
      <View style={styles.children}>{children}</View>
    </View>
  );
}
