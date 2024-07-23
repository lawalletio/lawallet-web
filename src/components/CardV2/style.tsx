import { styled } from 'styled-components';

import { appTheme } from '@/config/exports';

const slot = 4;

const handleChangeBackground = (variant: string) => {
  switch (variant) {
    case 'filled':
      return `background-color: ${appTheme.colors.gray15}; border: 1px solid ${appTheme.colors.gray15}`;
    default:
      return `background-color: transparent; border: none`;
  }
};

interface CardStyleProps {
  $spacing: number;
  $variant: string;
}

export const CardStyle = styled.div<CardStyleProps>`
  position: relative;
  overflow: hidden;

  display: flex;
  width: 100%;

  padding: ${(props) => props.$spacing * slot}px;

  ${(props) => handleChangeBackground(props.$variant)};
  border-radius: 12px;
`;
