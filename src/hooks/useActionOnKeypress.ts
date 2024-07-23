import { DependencyList, useEffect } from 'react';

export interface IUseActionOnEnter {
  handlePressKey: (e: KeyboardEvent) => void;
}

export const useActionOnKeypress = (
  key: string,
  action: () => void,
  dependences: DependencyList,
  condition?: boolean,
): IUseActionOnEnter => {
  const handlePressKey = async (e: KeyboardEvent) => {
    e.stopPropagation();
    if (e.key === key && !condition) action?.();
  };

  useEffect(() => {
    window.addEventListener('keydown', handlePressKey);

    return () => {
      window.removeEventListener('keydown', handlePressKey);
    };
  }, [...dependences]);

  return { handlePressKey };
};
