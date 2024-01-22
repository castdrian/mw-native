import ScreenLayout from '../../components/layout/ScreenLayout';
import { RegularText } from '../../components/ui/Text';

export default function AboutScreen() {
  return (
    <ScreenLayout
      title="About"
      subtitle="What is movie-web and how content is served?"
    >
      <RegularText className="text-white">
        No content is served from movie-web directly and movie web does not host
        anything.
      </RegularText>
    </ScreenLayout>
  );
}
