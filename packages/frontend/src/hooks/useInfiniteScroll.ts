import { useEffect, useRef } from 'react';

interface InfiniteScrollProps {
  onIntersect: () => void;
  hasMore: boolean;
}

export const useInfiniteScroll = ({
  onIntersect,
  hasMore,
}: InfiniteScrollProps) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
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
        observer.unobserve(instance);
      }
    };
  }, [onIntersect, hasMore]);

  return { ref };
};
