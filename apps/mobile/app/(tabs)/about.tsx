import ScreenLayout from '../../components/layout/ScreenLayout';
import { StyledText } from '../../components/ui/Styled';

export default function AboutScreen() {
  return (
    <ScreenLayout
      title="About"
      subtitle="What is movie-web and how content is served?"
    >
      <StyledText>
        No content is served from movie-web directly and movie web does not host
        anything.
      </StyledText>
    </ScreenLayout>
  );
}
