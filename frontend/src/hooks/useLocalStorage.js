import { useEffect, useState } from 'react';
import { safeJsonParse } from '../lib/utils';

export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    return safeJsonParse(window.localStorage.getItem(key), initialValue);
  });

  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}
