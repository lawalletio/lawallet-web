'use client';
import React, { useEffect } from 'react';
import { SelectTransferAmount } from '../components/SelectAmount';
import Navbar from '@/components/Layout/Navbar';
import { useLNURLContext } from '@/context/LNURLContext';
import { TransferTypes, InvoiceTransferType } from '@lawallet/react/types';
import { useRouter } from '@/navigation';
import { useTranslations } from 'next-intl';


const TransferOnchain = () => {
  const t = useTranslations();
  const { LNURLTransferInfo, setAmountToPay, setComment } = useLNURLContext();
  const router = useRouter();
  const trxInfo = defaultInvoiceTransfer();
/*
  useEffect(() => {
    if (LNURLTransferInfo.type === TransferTypes.LNURLW && LNURLTransferInfo.data && LNURLTransferInfo.amount)
      router.push(`/transfer/lnurl/summary?data=${LNURLTransferInfo.data}&amount=${LNURLTransferInfo.amount}`);
  }, [LNURLTransferInfo.amount]);
*/
  return (
    <>
      <Navbar showBackPage={true} title={'ON-CHAIN'} overrideBack={`/transfer`} />

      <SelectTransferAmount transferInfo={LNURLTransferInfo} setAmountToPay={setAmountToPay} setComment={setComment} />
    </>
  );
};

export default TransferOnchain;
