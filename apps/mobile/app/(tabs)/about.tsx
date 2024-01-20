import { StyleSheet } from 'react-native';

import ScreenLayout from '../../components/layout/screenLayout';
import { globalStyles } from '../../styles/global';
import { RegularText } from '../../components/Styled';

export default function AboutScreen() {
  return (
    <ScreenLayout
      title="About"
      subtitle="What is movie-web and how content is served?"
    >
      <RegularText style={globalStyles.textWhite}>
        No content is served from movie-web directly and movie web does not host
        anything.
      </RegularText>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
