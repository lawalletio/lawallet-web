'use client';
import React, { useEffect } from 'react';
import { SelectTransferAmount } from '../components/SelectAmount';
import Navbar from '@/components/Layout/Navbar';
import { useLNURLContext } from '@/context/LNURLContext';
import { TransferTypes } from '@lawallet/react/types';
import { useRouter } from '@/navigation';
import { useTranslations } from 'next-intl';

const TransferWithLNURL = () => {
  const t = useTranslations();
  const { LNURLTransferInfo, setAmountToPay, setComment } = useLNURLContext();
  const router = useRouter();

  useEffect(() => {
    if (LNURLTransferInfo.type === TransferTypes.LNURLW && LNURLTransferInfo.data && LNURLTransferInfo.amount)
      router.push(`/transfer/lnurl/summary?data=${LNURLTransferInfo.data}&amount=${LNURLTransferInfo.amount}`);
  }, [LNURLTransferInfo.amount]);

  return (
    <>
      <Navbar showBackPage={true} title={t('DEFINE_AMOUNT')} overrideBack={`/transfer`} />

      <SelectTransferAmount transferInfo={LNURLTransferInfo} setAmountToPay={setAmountToPay} setComment={setComment} />
    </>
  );
};

export default TransferWithLNURL;
