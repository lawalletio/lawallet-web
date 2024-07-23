import { InputGroup, InputGroupRight, InputWithLabel, Text } from '@lawallet/ui';
import { useTranslations } from 'next-intl';
import React, { ReactEventHandler } from 'react';

const LimitInput = ({
  amount,
  currency,
  onChange,
}: {
  amount: number;
  currency: string;
  onChange: ReactEventHandler;
}) => {
  const t = useTranslations();

  return (
    <InputGroup>
      <InputWithLabel
        onChange={onChange}
        type="number"
        name="max-amount"
        label={t('MAX_AMOUNT')}
        placeholder="0"
        value={amount.toString()}
      />

      <InputGroupRight>
        <Text size="small">{currency}</Text>
      </InputGroupRight>
    </InputGroup>
  );
};

export default LimitInput;
