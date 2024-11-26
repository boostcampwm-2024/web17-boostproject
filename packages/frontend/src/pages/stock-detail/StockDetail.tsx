import { useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { useParams } from 'react-router-dom';
import {
  AddAlarmForm,
  ChatPanel,
  NotificationPanel,
  StockMetricsPanel,
  TradingChart,
} from '.';
import { useGetLoginStatus } from '@/apis/queries/auth';
import {
  useGetOwnership,
  useGetStockDetail,
  usePostStockUser,
} from '@/apis/queries/stock-detail';
import Plus from '@/assets/plus.svg?react';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { modalMessage, ModalMessage } from '@/constants/modalMessage';

export const StockDetail = () => {
  const { stockId } = useParams();
  const [showModal, setShowModal] = useState(false);

  const { data: stockDetail } = useGetStockDetail({ stockId: stockId ?? '' });
  const { data: loginStatus } = useGetLoginStatus();
  const { data: userOwnerStock } = useGetOwnership({ stockId: stockId ?? '' });
  const { mutate, isSuccess } = usePostStockUser();

  const userStatus: ModalMessage = useMemo(() => {
    if (loginStatus?.message === 'Not Authenticated') {
      return 'NOT_AUTHENTICATED';
    }

    return userOwnerStock?.isOwner ? 'OWNERSHIP' : 'NOT_OWNERSHIP';
  }, [loginStatus?.message, userOwnerStock?.isOwner]);

  return (
    <div className="flex h-full flex-col gap-7">
      <header className="flex gap-7">
        <h1 className="display-bold24">{stockDetail?.name}</h1>
        <Button
          className="flex items-center justify-center gap-1"
          onClick={() => {
            setShowModal(true);
          }}
        >
          <Plus /> {modalMessage[userStatus].label}
        </Button>
      </header>
      {showModal &&
        createPortal(
          <Modal
            title="주식 소유"
            onClose={() => setShowModal(false)}
            onConfirm={() => {
              mutate({ stockId: stockId ?? '' });
              if (isSuccess) {
                setShowModal(false);
              }
            }}
            isShowButton={modalMessage[userStatus].button}
          >
            {modalMessage[userStatus].message}
          </Modal>,
          document.body,
        )}
      <article className="grid flex-1 grid-cols-[2.5fr_1fr_1fr] gap-5 [&_section]:gap-5">
        <section className="flex flex-col">
          <div className="relative h-full">
            <TradingChart />
          </div>
          <StockMetricsPanel />
        </section>
        <ChatPanel />
        <section className="flex flex-col">
          <NotificationPanel className="h-1/2" />
          <AddAlarmForm className="h-1/2" />
        </section>
      </article>
    </div>
  );
};
