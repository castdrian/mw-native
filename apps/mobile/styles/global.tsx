import { StyleSheet } from 'react-native';
import Colors from '../constants/Colors';

export const globalStyles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    backgroundColor: Colors.dark.shade900,
    paddingVertical: 48,
  },
  container: {
    padding: 24,
  },
  sectionTitle: {
    color: '#FFF',
    letterSpacing: -1.5,
    fontWeight: 'bold',
    fontSize: 28,
  },
  sectionSubtitle: {
    color: Colors.dark.shade200,
    fontSize: 14,
  },
  textWhite: {
    color: '#FFF',
  },
  flexRow: {
    flexDirection: 'row',
  },
  itemsCenter: {
    alignItems: 'center',
  },
  justifyCenter: {
    justifyContent: 'center',
  },
  input: {
    borderRadius: 24,
    paddingRight: 18,
    paddingVertical: 12,
    color: '#FFF',
  },
  border: {
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,.1)',
  },
  roundedFull: {
    borderRadius: 34,
  },
  fOpenSansLight: {
    fontFamily: 'OpenSansLight',
  },
  fOpenSansBold: {
    fontFamily: 'OpenSansBold',
  },
  fOpenSansSemiBold: {
    fontFamily: 'OpenSansSemiBold',
  },
  fOpenSansMedium: {
    fontFamily: 'OpenSansMedium',
  },
  fOpenSansExtraBold: {
    fontFamily: 'OpenSansExtraBold',
  },
  fOpenSansRegular: {
    fontFamily: 'OpenSansRegular',
  },
  textMuted: {
    color: '#5F5F7A',
  },
  dotSeperator: {
    width: 4,
    height: 4,
    backgroundColor: '#5F5F7A',
    borderRadius: 50,
  },
});
