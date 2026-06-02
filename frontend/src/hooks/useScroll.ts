import { useState, useEffect } from 'react';

/**
 * Custom hook to detect window scroll state
 * @param threshold The scroll y value to trigger the scroll state change
 * @returns boolean indicating if the window is scrolled past the threshold
 */
export const useScroll = (threshold = 10): boolean => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > threshold);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold]);

  return isScrolled;
};
