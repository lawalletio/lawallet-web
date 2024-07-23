'use client';
import Navbar from '@/components/Layout/Navbar';
import { useTranslations } from 'next-intl';
import { useActionOnKeypress } from '@/hooks/useActionOnKeypress';
import { useConfig, useInvoice, useTransfer } from '@lawallet/react';
import { TransferTypes } from '@lawallet/react/types';
import { ErrorTransfer } from '../../components/Error';
import { FinishTransfer } from '../../components/Finish';
import { Summary } from '../../components/Summary';

const TransferWithInvoice = ({ params }) => {
  const t = useTranslations();
  const config = useConfig();

  const { txInfo } = useInvoice({
    bolt11: params.bolt11,
    config,
  });

  const { isLoading, isError, isPending, isSuccess, execOutboundTransfer } = useTransfer({
    ...params,
    tokenName: 'BTC',
  });

  const executePayment = async () => {
    if (!txInfo.data || txInfo.type !== TransferTypes.INVOICE || txInfo.expired) return false;
    return execOutboundTransfer({ tags: [['bolt11', txInfo.data]], amount: txInfo.amount });
  };

  useActionOnKeypress('Enter', executePayment, [txInfo]);

  return (
    <>
      {isError || isSuccess ? (
        <>
          <Navbar />

          {isError ? <ErrorTransfer /> : <FinishTransfer transferInfo={txInfo} />}
        </>
      ) : (
        <>
          <Navbar showBackPage={true} title={t('VALIDATE_INFO')} overrideBack="/transfer" />
          <Summary
            isLoading={isLoading}
            isSuccess={isSuccess}
            isPending={isPending}
            data={txInfo.data}
            type={TransferTypes.INVOICE}
            amount={txInfo.amount}
            expired={txInfo.expired}
            onClick={executePayment}
          />
        </>
      )}
    </>
  );
};

export default TransferWithInvoice;
