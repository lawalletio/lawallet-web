import { useTranslations } from 'next-intl';
import { ReplacementParams } from '@lawallet/react/types';
import { useState } from 'react';

export interface IError {
  visible: boolean;
  text: string;
}

export interface IUseErrors {
  errorInfo: IError;
  modifyError: (text: string, params?: ReplacementParams) => void;
  isExactError: (errorCode: string, params?: ReplacementParams) => boolean;
  resetError: () => void;
}

export const initialErrorState: IError = {
  visible: false,
  text: '',
};

export default function useErrors(): IUseErrors {
  const t = useTranslations();
  const [errorInfo, setErrorInfo] = useState<IError>(initialErrorState);

  const getError = (errorCode: string, params?: ReplacementParams): string => {
    const text: string = t(errorCode, params);
    return text.toString();
  };

  const modifyError = (errorCode: string, params?: ReplacementParams) => {
    const text: string = getError(errorCode, params);
    setErrorInfo({ text, visible: true });
  };

  const isExactError = (errorCode: string, params?: ReplacementParams): boolean =>
    errorInfo.visible && errorInfo.text === getError(errorCode, params);

  const removeError = () => setErrorInfo({ ...errorInfo, visible: false });

  const resetError = () => {
    if (errorInfo.visible) removeError();
  };
  return {
    errorInfo,
    modifyError,
    isExactError,
    resetError,
  };
}
