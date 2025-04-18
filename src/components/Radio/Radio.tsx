import React from 'react';
import { RadioContainer, RadioInput } from './styles';
import { Text } from '@lawallet/ui';
import { Check } from 'lucide-react';

const Radio = (props) => {
  const { text, checked, onClick } = props;

  return (
    <RadioContainer>
      <button className="flex justify-between items-center w-full p-2" onClick={onClick}>
        <Text>{text}</Text>
        <RadioInput type="radio" onChange={() => null} name="date-time" checked={checked} />
        <div className="flex justify-center items-center h-8 w-8">
          {checked && <Check className="size-4 text-primary" />}
        </div>
      </button>
    </RadioContainer>
  );
};

export default Radio;
