'use client';

import { appTheme } from '@/config/exports';
import { styled } from 'styled-components';

interface QRCodeProps {
  size: number;
}

export const QRCode = styled.div<QRCodeProps>`
  position: relative;

  display: flex;
  justify-content: center;
  align-items: center;
  width: ${(props) => props.size ?? 200}px;
  height: ${(props) => props.size ?? 200}px;
  background-color: ${appTheme.colors.white};
  border-radius: 12px;

  cursor: pointer;
`;

interface ToastProps {
  $isShow: boolean;
}

export const Toast = styled.div<ToastProps>`
  position: absolute;
  bottom: 100%;
  margin-bottom: 5px;
  opacity: ${(props) => (props.$isShow ? 1 : 0)};
  z-index: 1;

  display: flex;
  justify-content: center;
  align-items: center;
  height: 28px;

  padding: 0 8px;

  background-color: ${appTheme.colors.primary15};
  border-radius: 12px;

  color: ${appTheme.colors.primary};

  div {
    position: relative;
  }

  span {
    position: absolute;
    top: 100%;
    z-index: 1;

    width: 0;
    height: 0;

    border-right: 5px solid transparent;
    border-bottom: 5px solid transparent;
    border-left: 5px solid transparent;
    border-top: 5px solid ${appTheme.colors.primary15};
  }
`;
