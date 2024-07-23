'use client';

import { useEffect } from 'react';
import ConfettiGenerator from 'confetti-js';

import { Confetti } from './style';

const settings = {
  target: 'confetti-box',
  max: '25',
  size: '1',
  animate: true,
  props: ['square'],
  colors: [
    [86, 182, 140],
    [253, 200, 0],
    [233, 80, 83],
  ],
  clock: '35',
  rotate: true,
  width: '600',
  height: '600',
  start_from_edge: true,
  respawn: false,
};

export default function Component() {
  useEffect(() => {
    const confetti = new ConfettiGenerator(settings);
    confetti.render();

    return () => confetti.clear();
  }, []);

  return (
    <Confetti>
      <canvas id="confetti-box"></canvas>
    </Confetti>
  );
}
