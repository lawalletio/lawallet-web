import React, { ReactNode } from 'react';

import { CardStyle } from './style';

interface CardProps {
  children: ReactNode;
  spacing?: number;
  variant?: 'unstyled' | 'filled';
}

export function Card(props: CardProps) {
  const { children, spacing = 0, variant = 'unstyled' } = props;

  return (
    <CardStyle $spacing={spacing} $variant={variant} className="card">
      {children}
    </CardStyle>
  );
}
