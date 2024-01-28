import { Text } from '../components/ui/Text';

import ScreenLayout from '../components/layout/ScreenLayout';

export default function AboutScreen() {
  return (
    <ScreenLayout
      title="About"
      subtitle="What is movie-web and how content is served?"
    >
      <Text>
        No content is served from movie-web directly and movie web does not host
        anything.
      </Text>
    </ScreenLayout>
  );
}
