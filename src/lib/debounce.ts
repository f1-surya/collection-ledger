let debounceTimer: number;

export function debounce<T extends unknown[]>(
  callback: (...args: T) => void,
  wait = 300,
): (...args: T) => void {
  return (...args: T) => {
    if (debounceTimer) window.clearTimeout(debounceTimer);
    debounceTimer = window.setTimeout(() => callback(...args), wait);
  };
}
