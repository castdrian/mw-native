import { Text } from 'react-native';

export const RegularText = ({ style, children, ...rest }: Text['props']) => {
  return (
    <Text style={[{ fontFamily: 'OpenSansRegular' }, style]} {...rest}>
      {children}
    </Text>
  );
};
export const BoldText = ({ style, children, ...rest }: Text['props']) => {
  return (
    <Text style={[{ fontFamily: 'OpenSansBold' }, style]} {...rest}>
      {children}
    </Text>
  );
};
export const SemiBoldText = ({ style, children, ...rest }: Text['props']) => {
  return (
    <Text style={[{ fontFamily: 'OpenSansSemiBold' }, style]} {...rest}>
      {children}
    </Text>
  );
};
export const MediumText = ({ style, children, ...rest }: Text['props']) => {
  return (
    <Text style={[{ fontFamily: 'OpenSansMedium' }, style]} {...rest}>
      {children}
    </Text>
  );
};
export const ExtraBoldText = ({ style, children, ...rest }: Text['props']) => {
  return (
    <Text style={[{ fontFamily: 'OpenSansExtraBold' }, style]} {...rest}>
      {children}
    </Text>
  );
};
export const LightText = ({ style, children, ...rest }: Text['props']) => {
  return (
    <Text style={[{ fontFamily: 'OpenSansLight' }, style]} {...rest}>
      {children}
    </Text>
  );
};
