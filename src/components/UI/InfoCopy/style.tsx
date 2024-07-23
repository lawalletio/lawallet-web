import { styled } from 'styled-components';

export const InfoCopy = styled.div`
  /* background-color: red; */

  p {
    &:last-child {
      overflow: hidden;
      text-overflow: ellipsis;

      width: 100%;
      max-width: 200px;
    }
  }
`;
