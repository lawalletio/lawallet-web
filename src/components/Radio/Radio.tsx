import React from 'react';
import { CheckDiv, RadioItem, RadioContainer, RadioInput } from './styles';
import { Text } from '@lawallet/ui';

const Radio = (props) => {
  const { text, checked, onClick } = props;

  return (
    <RadioContainer>
      <RadioItem onClick={onClick}>
        <Text>{text}</Text>
        <RadioInput type="radio" onChange={() => null} name="date-time" checked={checked} />
        <CheckDiv checked={checked}></CheckDiv>
      </RadioItem>
    </RadioContainer>
  );
};

export default Radio;
