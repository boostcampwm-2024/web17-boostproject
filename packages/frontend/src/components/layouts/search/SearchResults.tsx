import { Link } from 'react-router-dom';
import { usePostStockView } from '@/apis/queries/stock-detail';
import { type SearchResultsResponse } from '@/apis/queries/stocks';
import { Loader } from '@/components/ui/loader';

interface SearchResultsProps {
  data?: SearchResultsResponse;
  isLoading: boolean;
  isError: boolean;
}

export const SearchResults = ({
  data,
  isLoading,
  isError,
}: SearchResultsProps) => {
  const { mutate } = usePostStockView();

  if (isLoading) {
    return <Loader className="h-52 w-52" />;
  }

  if (isError || data?.searchResults.length === 0) {
    return <p className="text-dark-gray">검색 결과가 없어요.</p>;
  }

  if (data) {
    return (
      <ul className="flex flex-col gap-2">
        {data.searchResults.map((stock) => (
          <Link
            to={`/stocks/${stock.id}`}
            key={stock.id}
            onClick={() => mutate({ stockId: stock.id })}
            reloadDocument
            className="text-dark-gray hover:text-orange leading-7 hover:underline"
          >
            {stock.name}
          </Link>
        ))}
      </ul>
    );
  }
};
