import Lottie from 'react-lottie-player';
import loading from '@/components/lottie/loading-animation.json';

interface LoaderProps {
  className: string;
}

export const Loader = ({ className }: LoaderProps) => {
  return (
    <div className="flex justify-center">
      <Lottie className={className} animationData={loading} play speed={3} />
    </div>
  );
};
