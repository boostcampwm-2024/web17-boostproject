import { useEffect, useRef } from 'react';

interface InfiniteScrollProps {
  onIntersect: () => void;
  hasNextPage: boolean;
}

export const useInfiniteScroll = ({
  onIntersect,
  hasNextPage,
}: InfiniteScrollProps) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          onIntersect();
        }
      },
      { threshold: 0.5 },
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
  }, [onIntersect, hasNextPage]);

  return { ref };
};
