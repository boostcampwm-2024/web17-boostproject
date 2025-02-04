import { useState } from 'react';

interface NewsButtonProps {
  stockId: string;
  stockName: string;
}

export const NewsButton = ({ stockId, stockName }: NewsButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [news, setNews] = useState<any[]>([]);

  const handleClick = async () => {
    try {
      setIsOpen(true);
      const response = await fetch(`http://localhost:3000/api/stock/news/${stockId}`);
      const data = await response.json();
      setNews(data);
    } catch (error) {
      console.error('뉴스를 불러오는데 실패했습니다:', error);
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setIsOpen(false);
    }
  };

  return (
    <div>
      <button 
        onClick={handleClick}
        className="
          px-4 py-2 
          border border-gray-300
          bg-white
          hover:bg-gray-50
          text-gray-700 
          font-semibold
          rounded-md 
          shadow-sm
          transition-all 
          duration-200
          flex items-center 
          gap-2
          hover:shadow-md
          active:scale-95
        "
      >
        <svg 
          className="w-4 h-4" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v12a2 2 0 01-2 2z" 
          />
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M16 2v4M8 2v4M3 10h18" 
          />
        </svg>
        뉴스 보기
      </button>

      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[9999]"
          onClick={handleOverlayClick}
        >
          <div className="bg-white rounded-lg p-4 w-full max-w-xl max-h-[80vh] overflow-auto relative">
            <div className="flex justify-between items-center mb-4 sticky top-0 bg-white p-2">
              <h2 className="text-lg font-bold">{stockName} 뉴스</h2>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              {news.map((item, index) => (
                <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="font-bold text-lg">{item.title}</div>
                  <div className="text-gray-600 mt-2">{item.summary}</div>
                  {item.positiveContent && (
                    <div className="text-green-600 mt-2 bg-green-50 p-2 rounded">
                      긍정: {item.positiveContent}
                    </div>
                  )}
                  {item.negativeContent && (
                    <div className="text-red-600 mt-2 bg-red-50 p-2 rounded">
                      부정: {item.negativeContent}
                    </div>
                  )}
                  <div className="mt-3 space-y-1">
                    {item.link.split(',').map((link: string, i: number) => (
                      <a
                        key={i}
                        href={link.trim()}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline block hover:text-blue-600 transition-colors"
                      >
                        뉴스 링크 {i + 1}
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {news.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                뉴스가 없습니다
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}; 