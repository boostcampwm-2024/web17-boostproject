import { useMutation } from '@tanstack/react-query';
import {
  DeleteStockUserSchema,
  type DeleteStockUserRequest,
  type DeleteStockUser,
} from './schema';
import { deleteRequest } from '@/apis/utils/delete';

const deleteStockUser = ({ stockId }: DeleteStockUserRequest) =>
  deleteRequest<DeleteStockUser>({
    schema: DeleteStockUserSchema,
    url: '/api/stock/user',
    params: { stockId },
  });

export const useDeleteStockUser = () => {
  return useMutation({
    mutationKey: ['deleteStockUser'],
    mutationFn: ({ stockId }: DeleteStockUserRequest) =>
      deleteStockUser({ stockId }),
  });
};
