export const debounce = (func, wait) => {
  let timeoutId;

  return function debounced(...args) {
    // If there's an existing timeout, clear it so we can restart the timer
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    // Schedule a new invocation
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, wait);
  };
};
