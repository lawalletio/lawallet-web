import React, { useEffect } from 'react';

import { Button } from './UI/button';
import { Delete } from 'lucide-react';

const timeOut: Record<string, NodeJS.Timeout> = {};

type KeyboardProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  numpadData: any;
  disableKeydown?: boolean;
};

export function Keyboard({ numpadData, disableKeydown = false }: KeyboardProps) {
  const { handleNumpad, intAmount, resetAmount, concatNumber, deleteNumber } = numpadData;

  const handleDeleteOnMouseDown = () => (timeOut.reset = setTimeout(() => resetAmount(), 500));

  const handleDeleteOnMouseUp = () => clearTimeout(timeOut?.reset);

  useEffect(() => {
    if (!disableKeydown) {
      document.addEventListener('keydown', handleKeyPress);

      return () => document.removeEventListener('keydown', handleKeyPress);
    }
  }, [intAmount, disableKeydown]);

  const handleKeyPress = (e: KeyboardEvent) => {
    const { key } = e;
    const keysAccepted: string[] = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

    if (key == 'Backspace') deleteNumber();
    if (keysAccepted.includes(key)) concatNumber(key);
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <Button className="w-full" variant="ghost" onClick={() => handleNumpad('1')}>
          1
        </Button>
        <Button className="w-full" variant="ghost" onClick={() => handleNumpad('2')}>
          2
        </Button>
        <Button className="w-full" variant="ghost" onClick={() => handleNumpad('3')}>
          3
        </Button>
      </div>
      <div className="flex gap-2">
        <Button className="w-full" variant="ghost" onClick={() => handleNumpad('4')}>
          4
        </Button>
        <Button className="w-full" variant="ghost" onClick={() => handleNumpad('5')}>
          5
        </Button>
        <Button className="w-full" variant="ghost" onClick={() => handleNumpad('6')}>
          6
        </Button>
      </div>
      <div className="flex gap-2">
        <Button className="w-full" variant="ghost" onClick={() => handleNumpad('7')}>
          7
        </Button>
        <Button className="w-full" variant="ghost" onClick={() => handleNumpad('8')}>
          8
        </Button>
        <Button className="w-full" variant="ghost" onClick={() => handleNumpad('9')}>
          9
        </Button>
      </div>
      <div className="flex gap-2">
        <Button className="w-full" variant="ghost" onClick={() => handleNumpad('00')}>
          00
        </Button>
        <Button className="w-full" variant="ghost" onClick={() => handleNumpad('0')}>
          0
        </Button>
        <Button
          className="w-full"
          onTouchStart={handleDeleteOnMouseDown}
          onTouchEnd={handleDeleteOnMouseUp}
          onMouseDown={handleDeleteOnMouseDown}
          onMouseUp={handleDeleteOnMouseUp}
          variant="destructive"
          onClick={deleteNumber}
        >
          <Delete className="size-4" />
        </Button>
      </div>
    </div>
  );
}
