import { useState } from 'react';
import { useGetUserInfo } from '@/apis/queries/auth/useGetUserInfo';
import { usePostUserNickname } from '@/apis/queries/auth/usePostUserNickname';
import { Input } from '@/components/ui/input';

export const UserInfo = () => {
  const [isEdit, setIsEdit] = useState(false);
  const [newNickname, setNewNickname] = useState('');

  const { data } = useGetUserInfo();
  const { email, nickname } = data || {};

  const { mutate } = usePostUserNickname({ nickname: newNickname });

  return (
    <div>
      <div className="display-medium14 text-gray mb-5 flex gap-3">
        <h2 className="display-bold20 text-black">내정보</h2>
        {isEdit ? (
          <>
            <button
              onClick={() => {
                mutate();
                setIsEdit(false);
              }}
            >
              완료
            </button>
            <button onClick={() => setIsEdit(false)}>취소</button>
          </>
        ) : (
          <button onClick={() => setIsEdit(true)}>수정</button>
        )}
      </div>
      <section className="flex flex-col gap-3 [&>div]:flex [&>div]:gap-4">
        <div>
          <span className="text-gray">이메일</span>
          <span className="text-dark-gray">{email}</span>
        </div>
        <div>
          <span className="text-gray">닉네임</span>
          {isEdit ? (
            <Input
              defaultValue={nickname}
              autoFocus
              onChange={(e) => setNewNickname(e.target.value)}
            />
          ) : (
            <span className="text-dark-gray">{nickname}</span>
          )}
        </div>
      </section>
    </div>
  );
};
