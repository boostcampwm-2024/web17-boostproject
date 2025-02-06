import * as cheerio from 'cheerio';
import { getNews } from './news.info';
import { NewsItemDto } from '@/crawling/dto/newsItemDto';

export async function crawling(stock: string, news: NewsItemDto[]) {
  return {
    stockName: stock,
    news: await Promise.all(
      news.map(async (n) => {
        const url = decodeURI(n.link);
        return await fetch(url, {
          method: 'GET',
          headers: {
            'User-Agent':
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
            'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7',
          },
        }).then(async (r) => {
          const htmlString = await r.text();
          const $ = cheerio.load(htmlString);

          const date = $('span._ARTICLE_DATE_TIME').attr('data-date-time');
          const title = $('#title_area').text();
          const content = $('#dic_area').text();
          return {
            date: date,
            title: title,
            content: content,
            url: url,
          };
        });
      }),
    ),
  };
}

getNews('삼성전자')
  .then((r) => crawling(r!.stock, r!.response))
  .then((r) => console.log(r));
