import Lottie from 'react-lottie-player';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import error from '@/components/lottie/error-loading.json';
import { cn } from '@/utils/cn';

interface ErrorProps {
  className?: string;
}

export const Error = ({ className }: ErrorProps) => {
  const navigate = useNavigate();

  return (
    <div className="bg-extra-light-gray flex justify-center">
      <section className="flex flex-col items-center gap-5">
        <Lottie
          className={cn('h-36 w-36', className)}
          animationData={error}
          play
        />
        <p>에러가 발생했어요. 주춤주춤 팀을 찾아주세요.</p>
        <div className="flex gap-5">
          <Button onClick={() => navigate(-1)}>뒤로가기</Button>
          <Button onClick={() => navigate('/')}>홈</Button>
        </div>
      </section>
    </div>
  );
};
