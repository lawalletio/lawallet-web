'use client';

import { appTheme } from '@/config/exports';
import { styled } from 'styled-components';

interface ModalProps {
  $isOpen?: boolean;
}

export const Modal = styled.div<ModalProps>`
  position: fixed;
  top: 0;
  left: 0;
  z-index: 11;

  display: ${(props) => (props.$isOpen ? 'flex' : 'none')};
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;

  padding: 0 16px;

  &:before {
    content: '';

    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;

    width: 100%;
    height: 100%;

    background-color: rgba(28, 28, 28, 0.95);
    backdrop-filter: blur(16px);
  }
`;

export const ModalContent = styled.div`
  position: relative;
  z-index: 2;

  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;

  padding: 24px;

  background-color: ${appTheme.colors.gray15};
  border-radius: 24px;

  @media screen and (min-width: 1023px) {
    max-width: 320px;
  }
`;
