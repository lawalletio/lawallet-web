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
  const { transferInfo, setAmountToPay, setComment } = useLNURLContext();
  const router = useRouter();

  useEffect(() => {
    if (transferInfo.type === TransferTypes.LNURLW && transferInfo.data && transferInfo.amount)
      router.push(`/transfer/lnurl/summary?data=${transferInfo.data}&amount=${transferInfo.amount}`);
  }, [transferInfo.amount]);

  return (
    <>
      <Navbar showBackPage={true} title={t('DEFINE_AMOUNT')} overrideBack={`/transfer`} />

      <SelectTransferAmount transferInfo={transferInfo} setAmountToPay={setAmountToPay} setComment={setComment} />
    </>
  );
};

export default TransferWithLNURL;
