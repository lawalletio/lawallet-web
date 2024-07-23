'use client';

import { appTheme } from '@/config/exports';
import { styled } from 'styled-components';

interface SubnavbarProps {}

export const SubnavbarPrimitive = styled.div<SubnavbarProps>`
  position: fixed;
  bottom: 0;
  z-index: 10;

  width: 100%;

  padding-bottom: 12px;

  background-color: ${appTheme.colors.gray10};
  border-radius: 12px;

  .info {
    display: flex;
    justify-content: center;

    padding: 0 24px;

    > button {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      border: none;
      background-color: transparent;

      cursor: pointer;

      &.active {
        svg {
          color: ${(props) => props.theme.colors.primary};
        }
      }
    }
  }
`;
