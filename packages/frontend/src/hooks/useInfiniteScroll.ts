import { useEffect, useRef } from 'react';

interface InfiniteScrollProps {
  onIntersect: () => void;
}

export const useInfiniteScroll = ({ onIntersect }: InfiniteScrollProps) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          onIntersect();
        }
      },
      { threshold: 0.3 },
    );
    const instance = ref.current;

    if (instance) {
      observer.observe(instance);
    }

    return () => {
      if (instance) {
        observer.disconnect();
      }
    };
  }, [onIntersect]);

  return { ref };
};
