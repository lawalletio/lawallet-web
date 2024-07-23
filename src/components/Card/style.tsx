import { appTheme } from '@/config/exports';
import styled from 'styled-components';

interface CardProp {
  $isActive: boolean;
}

export const Card = styled.div<CardProp>`
  overflow: hidden;
  opacity: ${(props) => (props.$isActive ? 1 : 0.65)};

  width: 280px;
  height: 176px;

  border-radius: 12px;
  background-color: ${(props) => (props.$isActive ? appTheme.colors.primary : appTheme.colors.gray25)};

  mix-blend-mode: ${(props) => (props.$isActive ? 'normal' : 'luminosity')};
  transition-duration: 0.4s;
`;
