import { Inject, Injectable } from '@nestjs/common';
import axios from 'axios';
import { Logger } from 'winston';
import { SAMPLE_NEWS_SCRAP } from './sample';

@Injectable()
export class NewsClovaService {
  private readonly CLOVA_API_URL =
    'https://clovastudio.stream.ntruss.com/testapp/v1/chat-completions/HCX-DASH-001';
  private readonly CLOVA_API_KEY = process.env.CLOVA_API_KEY;

  constructor(@Inject('winston') private readonly logger: Logger) {}

  // TODO: 뉴스 데이터를 넣어주는 파라미터 추가
  async summarizeNews() {
    try {
      const clovaResponse = await axios.post(
        this.CLOVA_API_URL,
        {
          messages: [
            {
              role: 'system',
              content: this.getSystemPrompt(),
            },
            {
              role: 'user',
              content: JSON.stringify(SAMPLE_NEWS_SCRAP), // TODO: 파라미터값으로 변경
            },
          ],
          ...this.getParameters(),
        },
        {
          headers: this.getHeaders(),
        },
      );

      const content = JSON.parse(clovaResponse.data.result.message.content);
      return content;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        this.logger.error(
          `Failed to summarize news: status=${error.response?.status}, data=${error.response?.data}`,
        );
      } else {
        this.logger.error('Unknown Error', error);
      }
    }
  }

  private getSystemPrompt() {
    return '당신은 AI 기반 주식 분석 전문가입니다. 아래에 제공되는 JSON 형식의 뉴스 데이터를 분석하여, 종합적인 분석 결과를 도출해 주세요.\r\n\r\n입력 데이터는 다음과 같은 JSON 형식으로 제공됩니다:\r\n```json\r\n{\r\n  "stock_name": "종목 이름",\r\n  "news": [\r\n    {\r\n      "date": "기사 날짜",\r\n      "title": "기사 제목",\r\n      "content": "기사 내용",\r\n      "url": "기사 링크"\r\n    },\r\n    ...\r\n  ]\r\n}\r\n```\r\n\r\n분석해야 할 항목은 다음과 같습니다:\r\n\r\n1. **종목 정보:**\r\n   - stock_name을 기반으로 해당 종목의 stock_id를 찾아 포함\r\n   - 제공된 모든 뉴스의 url을 쉼표로 구분하여 link 필드에 포함\r\n\r\n2. **종합 분석:**\r\n   - title: 전체 뉴스 내용을 관통하는 핵심 주제나 이슈를 간단한 제목으로 작성\r\n   - summary: 모든 뉴스 기사의 주요 내용을 종합적으로 요약하여 작성 (400자 내외)\r\n\r\n3. **영향 분석:**\r\n   - positive_content: 기업, 산업, 경제에 긍정적 영향을 줄 수 있는 요소들을 분석하여 작성\r\n   - negative_content: 위험 요소나 부정적 영향을 줄 수 있는 요소들을 분석하여 작성\r\n\r\n출력은 다음과 같은 JSON 형식으로 제공해야 합니다:\r\n```json\r\n{\r\n  "stock_id": "종목 번호",\r\n  "stock_name": "종목 이름",\r\n  "link": "기사 링크들",\r\n  "title": "요약 타이틀",\r\n  "summary": "요약 내용",\r\n  "positive_content": "긍정적 측면",\r\n  "negative_content": "부정적 측면"\r\n}\r\n```\r\n\r\n분석 시 주의사항:\r\n1. 모든 뉴스 기사의 내용을 종합적으로 고려하여 분석합니다.\r\n2. 긍정적/부정적 내용이 없는 경우 "해당사항 없음"으로 작성합니다.\r\n3. 요약과 분석은 객관적이고 사실에 기반하여 작성합니다.\r\n4. 특정 종목의 stock_id를 모르는 경우 빈 문자열("")을 반환합니다.';
  }

  private getParameters() {
    return {
      topP: 0.8,
      topK: 0,
      maxTokens: 500,
      temperature: 0.5,
      repeatPenalty: 5.0,
      stopBefore: [],
      includeAiFilters: true,
      seed: 0,
    };
  }

  private getHeaders() {
    return {
      Authorization: `Bearer ${this.CLOVA_API_KEY}`,
      'Content-Type': 'application/json',
    };
  }
}
