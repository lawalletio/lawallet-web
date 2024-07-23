import { styled, keyframes } from 'styled-components';

import { appTheme } from '@/config/exports';

const iconRotate = keyframes`   
  to {
    transform: rotate(1turn)
  }
`;

export const LoaderStyle = styled.div`
  --_m: conic-gradient(#0000 10%, #000), linear-gradient(#000 0 0) content-box;
  mask: var(--_m);
  -webkit-mask: var(--_m);
  -webkit-mask-composite: source-out;
  mask-composite: subtract;
  aspect-ratio: 1;

  width: 100%;
  max-width: 32px;

  padding: 3px;
  background: ${appTheme.colors.primary};
  border-radius: 50%;

  animation: ${iconRotate} 1s infinite linear;
`;
