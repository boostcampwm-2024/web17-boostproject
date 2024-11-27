import { useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { GetLoginStatus } from '@/apis/queries/auth/schema';
import {
  useDeleteStockUser,
  usePostStockUser,
} from '@/apis/queries/stock-detail';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { modalMessage, ModalMessage } from '@/constants/modalMessage';

interface StockDetailHeaderProps {
  stockId: string;
  stockName: string;
  loginStatus: GetLoginStatus['message'];
  isOwnerStock: boolean;
}

export const StockDetailHeader = ({
  stockId,
  stockName,
  loginStatus,
  isOwnerStock,
}: StockDetailHeaderProps) => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const userStatus: ModalMessage = useMemo(() => {
    if (loginStatus === 'Not Authenticated') {
      return 'NOT_AUTHENTICATED';
    }

    return isOwnerStock ? 'OWNERSHIP' : 'NOT_OWNERSHIP';
  }, [loginStatus, isOwnerStock]);

  const { mutate: postStockUser, isSuccess: isSuccessPost } =
    usePostStockUser();
  const { mutate: deleteStockUser, isSuccess: isSuccessDelete } =
    useDeleteStockUser();

  const handleModalConfirm = () => {
    if (userStatus === 'NOT_OWNERSHIP') {
      postStockUser({ stockId });
    }

    if (userStatus === 'OWNERSHIP') {
      deleteStockUser({ stockId });
    }

    if (userStatus === 'NOT_AUTHENTICATED') {
      navigate('/login');
    }

    if (isSuccessPost || isSuccessDelete) {
      setShowModal(false);
    }
  };

  return (
    <header className="flex gap-7">
      <h1 className="display-bold24">{stockName}</h1>
      <Button
        className="flex items-center justify-center gap-1"
        onClick={() => {
          setShowModal(true);
        }}
      >
        {modalMessage[userStatus].label}
      </Button>
      {showModal &&
        createPortal(
          <Modal
            title="주식 소유"
            onClose={() => setShowModal(false)}
            onConfirm={handleModalConfirm}
          >
            {modalMessage[userStatus].message}
          </Modal>,
          document.body,
        )}
    </header>
  );
};
