import { useState, useEffect } from 'react';

const BANNER_EMOJIS = ['🚫', '⛔', '🚨', '💀', '🎭'];
const BANNER_ROTATION_INTERVAL = 9200;

export const useBannerRotation = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % BANNER_EMOJIS.length);
    }, BANNER_ROTATION_INTERVAL);

    return () => clearInterval(interval);
  }, []);

  return BANNER_EMOJIS[currentIndex];
};
