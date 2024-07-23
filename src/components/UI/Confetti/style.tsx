'use client';

import { styled } from 'styled-components';

interface ConfettiProps {}

export const Confetti = styled.div<ConfettiProps>`
  position: absolute;
  top: -100px;
  left: 0;
  z-index: -1;
  overflow-x: hidden;

  display: flex;
  justify-content: center;
  width: 100%;
  height: 100dvh;

  &:before {
    content: '';

    position: absolute;
    bottom: 0;
    left: 0;

    width: 100%;
    height: 65%;
    background: linear-gradient(to top, ${(props) => props.theme.colors.background}, rgba(28, 28, 28, 0));
  }
`;
