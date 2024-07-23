'use client';

import { appTheme } from '@/config/exports';
import { styled } from 'styled-components';

export const BackButtonStyled = styled.button`
  display: flex;
  align-items: center;

  background-color: transparent;
  border: none;

  color: ${appTheme.colors.primary};

  cursor: pointer;
`;
