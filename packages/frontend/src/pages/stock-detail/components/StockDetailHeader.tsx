import { useEffect, useState } from 'react';
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
  loginStatus: GetLoginStatus;
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
  const [userStatus, setUserStatus] =
    useState<ModalMessage>('NOT_AUTHENTICATED');

  useEffect(() => {
    if (loginStatus.message === 'Not Authenticated') {
      setUserStatus('NOT_AUTHENTICATED');
      return;
    }

    setUserStatus(() => {
      return isOwnerStock ? 'OWNERSHIP' : 'NOT_OWNERSHIP';
    });
  }, [isOwnerStock, loginStatus]);

  const { mutate: postStockUser } = usePostStockUser({
    onSuccess: () => setUserStatus('OWNERSHIP'),
  });

  const { mutate: deleteStockUser } = useDeleteStockUser({
    onSuccess: () => setUserStatus('NOT_OWNERSHIP'),
  });

  const handleModalConfirm = {
    NOT_OWNERSHIP: () => postStockUser({ stockId }),
    OWNERSHIP: () => deleteStockUser({ stockId }),
    NOT_AUTHENTICATED: () => navigate('/login'),
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
            onConfirm={() => {
              handleModalConfirm[userStatus]();
              setShowModal(false);
            }}
          >
            {modalMessage[userStatus].message}
          </Modal>,
          document.body,
        )}
    </header>
  );
};
