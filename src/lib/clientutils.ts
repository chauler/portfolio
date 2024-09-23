import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";

export function useDebounce<T extends unknown[]>(
  callback: (...args: T) => unknown,
  delay: number,
) {
  const callbackRef = useRef(callback);

  useLayoutEffect(() => {
    callbackRef.current = callback;
  });

  let timer: string | number | NodeJS.Timeout | undefined;

  const naiveDebounce = (
    func: (...args: T) => unknown,
    delayMs: number,
    ...args: T
  ) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func(...args);
    }, delayMs);
  };

  return useMemo<(...args: T) => unknown>(
    () =>
      (...args: T) =>
        naiveDebounce(callbackRef.current, delay, ...args),
    [delay],
  );
}
