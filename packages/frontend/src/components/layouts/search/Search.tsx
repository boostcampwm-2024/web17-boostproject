import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/utils/cn';

interface SearchProps {
  className?: string;
}

export const Search = ({ className }: SearchProps) => {
  const searchResult = [''];

  return (
    <div className={cn('bg-white p-10 shadow', className)}>
      <h3 className="display-bold24 mb-2">검색</h3>
      <p className="display-medium16 text-dark-gray mb-10">
        주식을 검색하세요.
      </p>
      <div className="mb-8 flex gap-4">
        <Input placeholder="검색어" />
        <Button size="sm">검색</Button>
      </div>
      {searchResult.map((word) => (
        // TODO: 추후 Link로 수정
        <p className="text-dark-gray leading-7">{word}</p>
      ))}
    </div>
  );
};
