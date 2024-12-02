import { type FormEvent, useState } from 'react';
import { SearchResults } from './SearchResults';
import { useGetSearchStocks } from '@/apis/queries/stocks';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/utils/cn';

interface SearchProps {
  className?: string;
}

export const Search = ({ className }: SearchProps) => {
  const [stockName, setStockName] = useState('');
  const { data, refetch, isLoading, isError } = useGetSearchStocks(stockName);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    refetch();
  };

  return (
    <div className={cn('bg-white p-10 shadow', className)}>
      <h3 className="display-bold24 mb-2">검색</h3>
      <p className="display-medium16 text-dark-gray mb-10">
        주식을 검색하세요.
      </p>
      <form className="mb-8 flex gap-4" onSubmit={handleSubmit}>
        <Input
          className="bg-white"
          placeholder="검색어"
          onChange={(e) => setStockName(e.target.value)}
          autoFocus
        />
        <Button type="submit" size="sm">
          검색
        </Button>
      </form>
      <SearchResults data={data} isLoading={isLoading} isError={isError} />
    </div>
  );
};
