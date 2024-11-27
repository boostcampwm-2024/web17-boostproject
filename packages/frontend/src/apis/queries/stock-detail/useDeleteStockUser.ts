import { useMutation } from '@tanstack/react-query';
import {
  DeleteStockUserSchema,
  type DeleteStockUserRequest,
  type DeleteStockUser,
} from './schema';
import { deleteRequest } from '@/apis/utils/delete';

const deleteStockUser = ({ userStockId }: DeleteStockUserRequest) =>
  deleteRequest<DeleteStockUser>({
    schema: DeleteStockUserSchema,
    url: 'api/stock/user',
    params: { userStockId },
  });

export const useDeleteStockUser = () => {
  return useMutation({
    mutationKey: ['deleteStockUser'],
    mutationFn: ({ userStockId }: DeleteStockUserRequest) =>
      deleteStockUser({ userStockId }),
  });
};
