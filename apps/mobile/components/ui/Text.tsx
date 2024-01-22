import { Text } from 'react-native';

export function RegularText({ style, children, ...rest }: Text['props']) {
  return (
    <Text style={[{ fontFamily: 'OpenSansRegular' }, style]} {...rest}>
      {children}
    </Text>
  );
}
export function BoldText({ style, children, ...rest }: Text['props']) {
  return (
    <Text style={[{ fontFamily: 'OpenSansBold' }, style]} {...rest}>
      {children}
    </Text>
  );
}
export function SemiBoldText({ style, children, ...rest }: Text['props']) {
  return (
    <Text style={[{ fontFamily: 'OpenSansSemiBold' }, style]} {...rest}>
      {children}
    </Text>
  );
}
export function MediumText({ style, children, ...rest }: Text['props']) {
  return (
    <Text style={[{ fontFamily: 'OpenSansMedium' }, style]} {...rest}>
      {children}
    </Text>
  );
}
export function ExtraBoldText({ style, children, ...rest }: Text['props']) {
  return (
    <Text style={[{ fontFamily: 'OpenSansExtraBold' }, style]} {...rest}>
      {children}
    </Text>
  );
}
export function LightText({ style, children, ...rest }: Text['props']) {
  return (
    <Text style={[{ fontFamily: 'OpenSansLight' }, style]} {...rest}>
      {children}
    </Text>
  );
}
