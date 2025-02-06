import { NewsInfoDto } from '@/crawling/dto/newsInfoDto';

const NAVER_CLIENT_ID: string = process.env.NAVER_CLIENT_ID
  ? process.env.NAVER_CLIENT_ID
  : '';
const NAVER_CLIENT_SECRET: string = process.env.NAVER_CLIENT_SECRET
  ? process.env.NAVER_CLIENT_SECRET
  : '';
const url: string = process.env.NAVER_NEWS_URL
  ? process.env.NAVER_NEWS_URL
  : '';


export async function getNews(stockName: string) {
  const encodedStockName = encodeURI(stockName);
  const newsUrl = `${url}?query=${encodedStockName}&display=50&sort=sim`;
  try {
    const res: NewsInfoDto = await fetch(newsUrl, {
      method: 'GET',
      headers: {
        'X-Naver-Client-Id': NAVER_CLIENT_ID,
        'X-Naver-Client-Secret': NAVER_CLIENT_SECRET,
      },
    }).then((res) => res.json());
    // 여기도 DTO를 만들어야할까?
    return {
      stock: stockName,
      response: await extractNaverNews(res),
    };
  } catch (err) {
    console.log(err);
  }
  return;
}

// 네이버 뉴스 API로부터 받아온 데이터에서 naver 뉴스들만 뽑아내기
export async function extractNaverNews(newsData?: NewsInfoDto) {
  return newsData!.items.filter((e) => e.link.includes('n.news.naver.com'));
}
