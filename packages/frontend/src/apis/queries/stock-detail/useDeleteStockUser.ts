import { useMutation, useQueryClient } from '@tanstack/react-query';
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

export const useDeleteStockUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['deleteStockUser'],
    mutationFn: ({ stockId }: DeleteStockUserRequest) =>
      deleteStockUser({ stockId }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['userStock'] }),
  });
};
