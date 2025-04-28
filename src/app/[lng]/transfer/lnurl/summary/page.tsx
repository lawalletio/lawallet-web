'use client';
import Navbar from '@/components/Layout/Navbar';
import { useLNURLContext } from '@/context/LNURLContext';
import { useTranslations } from 'next-intl';
import { useActionOnKeypress } from '@/hooks/useActionOnKeypress';
import { TransferTypes } from '@lawallet/react/types';
import { ErrorTransfer } from '../../components/Error';
import { FinishTransfer } from '../../components/Finish';
import { Summary } from '../../components/Summary';

const page = () => {
  const t = useTranslations();
  const { transferInfo, isSuccess, isPending, isError, execute, isLoading } = useLNURLContext();

  useActionOnKeypress('Enter', execute, [transferInfo]);

  return (
    <>
      {isSuccess || isError ? (
        <>
          <Navbar />

          {isError ? <ErrorTransfer /> : <FinishTransfer transferInfo={transferInfo} />}
        </>
      ) : (
        <>
          <Navbar
            showBackPage={true}
            title={t('VALIDATE_INFO')}
            overrideBack={
              transferInfo.type === TransferTypes.LNURLW
                ? `/transfer`
                : `/transfer/lnurl?data=${transferInfo.data}&amount=${transferInfo.amount}${transferInfo.comment ? `&comment=${transferInfo.comment}` : ''}`
            }
          />
          <Summary
            isLoading={isLoading}
            isSuccess={isSuccess}
            isPending={isPending}
            data={transferInfo.data}
            type={transferInfo.type}
            amount={transferInfo.amount}
            expired={false}
            onClick={execute}
          />
        </>
      )}
    </>
  );
};

export default page;
