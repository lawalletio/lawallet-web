import { useState } from 'react';

export type AlertTypes = 'success' | 'warning' | 'error';

interface Alert {
  title?: string;
  description: string;
  type: AlertTypes;
}

export interface UseAlertReturns {
  alert: Alert | null;
  showAlert: (props: Alert) => void;
}

const useAlert = (): UseAlertReturns => {
  const [alert, setAlert] = useState<Alert | null>(null);

  const showAlert = ({ title, description, type }: Alert) => {
    setAlert({
      title,
      description,
      type,
    });

    setTimeout(() => {
      setAlert(null);
    }, 3000);
  };

  return { alert, showAlert };
};

export default useAlert;
