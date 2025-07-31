/**
 * Debounce function - delays execution until after a specified delay
 * @param {Function} func - Function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} Debounced function
 */
export const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
};

/**
 * Throttle function - limits execution to once per specified interval
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {Function} Throttled function
 */
export const throttle = (func, limit) => {
  let inThrottle;
  return (...args) => {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

/**
 * Simple memoization function
 * @param {Function} func - Function to memoize
 * @returns {Function} Memoized function
 */
export const memoize = (func) => {
  const cache = new Map();
  return (...args) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    const result = func.apply(this, args);
    cache.set(key, result);
    return result;
  };
};

/**
 * Performance measurement utility
 * @param {string} label - Label for the measurement
 * @param {Function} fn - Function to measure
 * @returns {any} Result of the function
 */
export const measurePerformance = (label, fn) => {
  const start = performance.now();
  const result = fn();
  const end = performance.now();

  if (import.meta.env.DEV) {
    console.log(`${label}: ${(end - start).toFixed(2)}ms`);
  }

  return result;
};

/**
 * Batch DOM updates for better performance
 * @param {Function} fn - Function containing DOM updates
 */
export const batchDOMUpdates = (fn) => {
  if (typeof window !== "undefined" && window.requestAnimationFrame) {
    requestAnimationFrame(fn);
  } else {
    setTimeout(fn, 0);
  }
};
