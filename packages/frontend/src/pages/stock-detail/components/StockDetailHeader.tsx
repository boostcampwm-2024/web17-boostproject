import { useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { useGetLoginStatus } from '@/apis/queries/auth';
import {
  useDeleteStockUser,
  useGetOwnership,
  usePostStockUser,
} from '@/apis/queries/stock-detail';
import Plus from '@/assets/plus.svg?react';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { modalMessage, ModalMessage } from '@/constants/modalMessage';

interface StockDetailHeaderProps {
  stockId: string;
  stockName: string;
}

export const StockDetailHeader = ({
  stockId,
  stockName,
}: StockDetailHeaderProps) => {
  const [showModal, setShowModal] = useState(false);
  const { data: loginStatus } = useGetLoginStatus();
  const { data: userOwnerStock } = useGetOwnership({ stockId: stockId ?? '' });

  const userStatus: ModalMessage = useMemo(() => {
    if (loginStatus?.message === 'Not Authenticated') {
      return 'NOT_AUTHENTICATED';
    }

    return userOwnerStock?.isOwner ? 'OWNERSHIP' : 'NOT_OWNERSHIP';
  }, [loginStatus?.message, userOwnerStock?.isOwner]);

  const { mutate: postStockUser, isSuccess: isSuccessPost } =
    usePostStockUser();
  const { mutate: deleteStockUser, isSuccess: isSuccessDelete } =
    useDeleteStockUser();

  const handleModalConfirm = () => {
    if (userStatus === 'NOT_OWNERSHIP') {
      postStockUser({ stockId: stockId ?? '' });
    }

    if (userStatus === 'OWNERSHIP') {
      deleteStockUser({ userStockId: stockId ?? '' });
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
        <Plus /> {modalMessage[userStatus].label}
      </Button>
      {showModal &&
        createPortal(
          <Modal
            title="주식 소유"
            onClose={() => setShowModal(false)}
            onConfirm={handleModalConfirm}
            isShowButton={modalMessage[userStatus].button}
          >
            {modalMessage[userStatus].message}
          </Modal>,
          document.body,
        )}
    </header>
  );
};
