'use client';
import { LNURLProvider } from '@/context/LNURLContext';
import React, { ReactNode } from 'react';

const layout = ({ children }: { children: ReactNode }) => {
  return <LNURLProvider>{children}</LNURLProvider>;
};

export default layout;
