import { StyledText, StyledView } from '../ui/Styled';

type Props = {
  title?: React.ReactNode | string;
  subtitle?: string;
  children?: React.ReactNode;
};

export default function ScreenLayout({ title, subtitle, children }: Props) {
  return (
    <StyledView tw="bg-shade-900 flex-1 p-12">
      {typeof title === 'string' && (
        <StyledText className="text-2xl font-bold text-white">
          {title}
        </StyledText>
      )}
      {typeof title !== 'string' && title}
      <StyledText className="mt-1 text-sm font-bold text-white">
        {subtitle}
      </StyledText>
      <StyledView className="py-3">{children}</StyledView>
    </StyledView>
  );
}
