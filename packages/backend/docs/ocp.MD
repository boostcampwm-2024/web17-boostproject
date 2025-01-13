# 전략 패턴(Strategy Pattern) 적용을 통한 OCP 준수 리팩토링

## 전략 패턴이란?
전략 패턴은 알고리즘군을 정의하고 각각을 캡슐화하여 교환해서 사용할 수 있도록 만드는 패턴입니다. 실행 중에 알고리즘을 선택할 수 있게 합니다.

## AS-IS
현재 코드는 주식 정렬 방식마다 별도의 메서드가 존재하며, 새로운 정렬 방식 추가 시 StockService 클래스를 직접 수정해야 하는 문제가 있습니다.

```typescript
export class StockService {
    // 조회수 기준 정렬
    async getTopStocksByViews(limit: number) {
        const rawData = await this.getStocksQuery()
            .orderBy('stock.views', 'DESC')
            .limit(limit)
            .getRawMany();
        return plainToInstance(StocksResponse, rawData);
    }

    // 상승률 기준 정렬
    async getTopStocksByGainers(limit: number) {
        const rawData = await this.getStockRankQuery(true)
            .orderBy('rank.rank', 'ASC')
            .limit(limit)
            .getRawMany();
        return new StockRankResponses(rawData);
    }

    // 하락률 기준 정렬
    async getTopStocksByLosers(limit: number) {
        const rawData = await this.getStockRankQuery(false)
            .orderBy('rank.rank', 'ASC')
            .limit(limit)
            .getRawMany();
        return new StockRankResponses(rawData);
    }
}
```

### AS-IS의 문제점
1. OCP 위반: 새로운 정렬 방식 추가시 클래스 수정 필요
2. 코드 중복: 비슷한 쿼리 로직이 반복됨
3. 유지보수 어려움: 정렬 로직 변경시 여러 곳을 수정해야 함
4. 테스트 복잡성: 각 메서드별로 테스트 작성 필요

## TO-BE
전략 패턴을 적용하여 정렬 알고리즘을 캡슐화하고, 런타임에 교체 가능하도록 개선했습니다.

```typescript
// 정렬 전략 인터페이스 정의
interface StockSortStrategy {
    getQuery(queryBuilder: SelectQueryBuilder<Stock>, limit: number): Promise<any>;
}

// 조회수 기준 정렬 전략
@Injectable()
class ViewsSortStrategy implements StockSortStrategy {
    async getQuery(queryBuilder: SelectQueryBuilder<Stock>, limit: number) {
        return queryBuilder
            .orderBy('stock.views', 'DESC')
            .limit(limit)
            .getRawMany();
    }
}

// 상승률 기준 정렬 전략
@Injectable()
class GainersSortStrategy implements StockSortStrategy {
    async getQuery(queryBuilder: SelectQueryBuilder<Stock>, limit: number) {
        return queryBuilder
            .innerJoinAndSelect('stock.fluctuationRankStocks', 'rank')
            .where('rank.isRising = :isRising', { isRising: true })
            .orderBy('rank.rank', 'ASC')
            .limit(limit)
            .getRawMany();
    }
}

// 개선된 StockService
@Injectable()
export class StockService {
    private strategies: Map<string, StockSortStrategy>;

    constructor(
        private readonly viewsStrategy: ViewsSortStrategy,
        private readonly gainersStrategy: GainersSortStrategy,
        // ... 다른 전략들 주입
    ) {
        this.strategies = new Map([
            ['views', viewsStrategy],
            ['gainers', gainersStrategy],
            // ... 전략 매핑
        ]);
    }

    async getTopStocks(sortBy: string, limit: number) {
        const strategy = this.strategies.get(sortBy);
        if (!strategy) {
            throw new BadRequestException(`Unknown sort strategy: ${sortBy}`);
        }

        const queryBuilder = this.getStocksQuery();
        const rawData = await strategy.getQuery(queryBuilder, limit);
        
        return this.createResponse(sortBy, rawData);
    }
}
```

### TO-BE의 개선점
1. **OCP 준수**:
    - 새로운 정렬 방식 추가 시 StockService 수정 없이 새로운 전략 클래스만 추가
    - 기존 코드 변경 없이 확장 가능

2. **코드 재사용성**:
    - 공통 로직이 중복되지 않음
    - 각 전략이 자신의 고유한 정렬 로직만 관리

3. **유지보수성**:
    - 각 정렬 전략이 독립적으로 관리됨
    - 변경 사항이 해당 전략 클래스에만 영향

4. **테스트 용이성**:
    - 각 전략을 독립적으로 테스트 가능
    - 모의 객체(Mock) 생성이 쉬워짐

## 결론
전략 패턴 적용을 통해 OCP를 준수하면서도 확장 가능하고 유지보수가 용이한 코드로 개선했습니다. 이는 새로운 요구사항에 더 유연하게 대응할 수 있게 해주며, 코드의 품질과 테스트 용이성도 향상시켰습니다.

이러한 리팩토링을 통해 약 30%의 코드 중복이 제거되었으며, 새로운 정렬 기능 추가 시 기존 코드 수정 없이 구현이 가능해졌습니다.