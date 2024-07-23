import { styled } from 'styled-components';

export const Default = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: -12px;

  button {
    width: 65px !important;
    height: 65px !important;

    svg {
      width: 32px !important;
      height: 32px !important;
    }
  }
`;
