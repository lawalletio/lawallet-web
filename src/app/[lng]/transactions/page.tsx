'use client';

import Navbar from '@/components/Layout/Navbar';
import TransactionItem from '@/components/TransactionItem';
import { appTheme } from '@/config/exports';
import { useRouter } from '@/navigation';
import { useTransactions } from '@lawallet/react';
import { Button, Container, Divider, Flex, Footer, Text } from '@lawallet/ui';
import { differenceInCalendarDays } from 'date-fns';
import { useTranslations } from 'next-intl';
import React from 'react';

let dateToRender: Date | null = null;

export default function Page() {
  const t = useTranslations();
  const router = useRouter();
  const transactions = useTransactions();

  // const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);

  // const loadMoreTransactions = () => {
  //   const actLength: number = filteredTransactions.length;
  //   if (actLength === transactions.length) return;

  //   setTimeout(() => {
  //     setFilteredTransactions((prev) => [...prev, ...transactions.slice(actLength, actLength + 10)]);
  //   }, 600);
  // };

  // useEffect(() => {
  //   if (transactions.length) setFilteredTransactions(transactions.slice(0, 15));
  // }, [transactions]);

  return (
    <>
      <Navbar showBackPage={true} title={t('ACTIVITY')} />

      <Container size="small">
        {/* <InfiniteScroll
          dataLength={filteredTransactions.length}
          next={loadMoreTransactions}
          hasMore={filteredTransactions.length < transactions.length}
          loader={<Loader />}
        > */}
        <Flex direction="column" gap={4}>
          {transactions.map((transaction) => {
            const txDate = new Date(transaction.createdAt);

            if (!dateToRender || dateToRender.toDateString() !== txDate.toDateString()) {
              dateToRender = txDate;

              const differenceWithToday: number = differenceInCalendarDays(new Date(), txDate);
              const isToday: boolean = differenceWithToday === 0;
              const isYesterday: boolean = differenceWithToday === 1;

              return (
                <React.Fragment key={transaction.id}>
                  <Divider y={8} />
                  <Text size="small" color={appTheme.colors.gray50}>
                    {isToday ? t('TODAY') : isYesterday ? t('YESTERDAY') : txDate.toLocaleDateString()}
                  </Text>

                  <TransactionItem transaction={transaction} />
                </React.Fragment>
              );
            } else {
              return (
                <React.Fragment key={transaction.id}>
                  <TransactionItem transaction={transaction} />
                </React.Fragment>
              );
            }
          })}
        </Flex>
        {/* </InfiniteScroll> */}
      </Container>

      <Divider y={64} />

      <Footer>
        <Button variant="bezeledGray" onClick={() => router.push('/dashboard')}>
          {t('BACK')}
        </Button>
      </Footer>
    </>
  );
}
