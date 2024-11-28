import { Button } from '../button';
import { useOutsideClick } from '@/hooks/useOutsideClick';

interface ModalProps {
  title: string;
  children: string;
  onClose: () => void;
  onConfirm: () => void;
}

export const Modal = ({ title, children, onClose, onConfirm }: ModalProps) => {
  const ref = useOutsideClick(onClose);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div
        className="relative flex flex-col items-center justify-center gap-8 rounded-md bg-white p-10 px-24 shadow"
        ref={ref}
      >
        <section className="flex flex-col items-center gap-1">
          <h2 className="display-bold20">{title}</h2>
          <p>{children}</p>
        </section>
        <section className="flex gap-3">
          <Button onClick={onClose}>취소</Button>
          <Button
            backgroundColor="orange"
            textColor="white"
            onClick={onConfirm}
          >
            확인
          </Button>
        </section>
      </div>
    </div>
  );
};
