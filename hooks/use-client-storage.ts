'use client';

import { useSyncExternalStore } from 'react';

const emptySubscribe = () => () => {};

export function useIsClient(): boolean {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}

export function useLocalStorage<T>(key: string, initialValue: T): [T, (val: T | ((prev: T) => T)) => void] {
  const getSnapshot = () => {
    if (typeof window === 'undefined') return JSON.stringify(initialValue);
    try {
      const item = window.localStorage.getItem(key);
      return item !== null ? item : JSON.stringify(initialValue);
    } catch {
      return JSON.stringify(initialValue);
    }
  };

  const getServerSnapshot = () => JSON.stringify(initialValue);

  const subscribe = (callback: () => void) => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === key) {
        callback();
      }
    };
    window.addEventListener('storage', handleStorage);
    window.addEventListener('local-storage-update', callback);
    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('local-storage-update', callback);
    };
  };

  const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  
  let parsedValue: T = initialValue;
  try {
    parsedValue = JSON.parse(raw);
  } catch {
    parsedValue = initialValue;
  }

  const setValue = (valOrFn: T | ((prev: T) => T)) => {
    try {
      const nextValue =
        typeof valOrFn === 'function' ? (valOrFn as (prev: T) => T)(parsedValue) : valOrFn;
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(nextValue));
        window.dispatchEvent(new Event('local-storage-update'));
      }
    } catch (e) {
      console.error(e);
    }
  };

  return [parsedValue, setValue];
}
