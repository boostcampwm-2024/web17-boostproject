import { useMutation, UseMutationOptions } from '@tanstack/react-query';
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
    data: { stockId },
  });

export const useDeleteStockUser = (
  options?: UseMutationOptions<DeleteStockUser, Error, DeleteStockUserRequest>,
) => {
  return useMutation({
    mutationKey: ['deleteStockUser'],
    mutationFn: ({ stockId }: DeleteStockUserRequest) =>
      deleteStockUser({ stockId }),
    ...options,
  });
};
