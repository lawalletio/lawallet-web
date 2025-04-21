import { CaretLeftIcon } from '@bitcoin-design/bitcoin-icons-react/filled';
import { Icon } from '@lawallet/ui';
import { useTranslations } from 'next-intl';
import { BackButtonStyled } from './style';
import { useRouter } from '@/navigation';

interface ComponentProps {
  overrideBack?: string;
}

const BackButton = ({ overrideBack }: ComponentProps) => {
  const router = useRouter();
  const t = useTranslations();

  return (
    <BackButtonStyled
      onClick={() => {
        overrideBack ? router.push(overrideBack) : router.back();
      }}
    >
      <Icon size="small">
        <CaretLeftIcon />
      </Icon>
      {t('BACK')}
    </BackButtonStyled>
  );
};

export default BackButton;
