import { Text } from '@lawallet/ui';
import { useEffect, useState } from 'react';

const formatTime = (time: number): number | string => {
  let minutes: number | string = Math.floor(time / 60);
  let seconds: number | string = Math.floor(time - minutes * 60);

  if (minutes < 10) minutes = '0' + minutes;
  if (seconds < 10) seconds = '0' + seconds;

  return minutes + ':' + seconds;
};

let timerInterval: NodeJS.Timeout;

export default function Countdown({ seconds }: { seconds: number }) {
  const [countdown, setCountdown] = useState<number>(seconds);

  useEffect(() => {
    timerInterval = setInterval(() => {
      setCountdown((prev: number) => prev - 1);
    }, 1000);

    return () => clearInterval(timerInterval);
  }, []);

  useEffect(() => {
    if (countdown <= 0) {
      clearInterval(timerInterval);

      window.location.reload();
    }
  }, [countdown]);

  return <Text>{formatTime(countdown)}</Text>;
}
