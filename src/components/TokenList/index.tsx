'use client';

import { CurrenciesList, useSettings } from '@lawallet/react';
import { Container, Flex } from '@lawallet/ui';

import { Button } from '@/components/UI/button';

import { TokenListStyle } from './style';

export function TokenList() {
  const settings = useSettings();

  return (
    <TokenListStyle>
      <Container>
        <Flex gap={4} justify="center">
          {CurrenciesList.map((currency) => {
            const selected: boolean = settings.props.currency === currency;

            return (
              <Button
                key={currency}
                variant={selected ? 'terciary' : 'secondary'}
                size="sm"
                onClick={() => settings.changeCurrency(currency)}
              >
                {currency}
              </Button>
            );
          })}
        </Flex>
      </Container>
    </TokenListStyle>
  );
}
