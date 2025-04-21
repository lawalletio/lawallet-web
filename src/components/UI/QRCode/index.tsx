'use client';

import ReactQRCode from 'qrcode.react';
import { useTranslations } from 'next-intl';

import { copy } from '@/utils/share';
import { useToast } from '@/hooks/use-toast';

import { appTheme } from '@/config/exports';

import { QRCode } from './style';

interface ComponentProps {
  value: string;
  size?: number;
  borderSize?: number;
  textToCopy?: string;
}

export default function Component({ value, size = 150, borderSize = 40, textToCopy }: ComponentProps) {
  const t = useTranslations();
  const { toast } = useToast();

  const handleCopy = (text: string) => {
    copy(text).then((res) => {
      toast({
        description: res ? t('SUCCESS_COPY') : t('ERROR_COPY'),
        variant: res ? 'default' : 'destructive',
        duration: 1400,
      });
    });
  };

  return (
    <>
      <QRCode
        size={size + borderSize}
        onClick={() => {
          handleCopy(textToCopy ? textToCopy : value);
        }}
      >
        <ReactQRCode value={value} size={size} fgColor={appTheme.colors.black} bgColor={appTheme.colors.white} />
      </QRCode>
    </>
  );
}
