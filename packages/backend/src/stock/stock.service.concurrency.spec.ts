import { DataSource } from 'typeorm';
import { StockTest } from '@/stock/domain/stock-test.entity';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';


describe('StockService Concurrency Test', () => {
  let dataSource: DataSource;

  beforeAll(async () => {
    // ConfigModule 먼저 초기화
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot({
        envFilePath: '.env'  // 또는 '.env.development'
      })],
    }).compile();

    dataSource = new DataSource({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: 'test_db',
      entities: [StockTest],
      synchronize: true,
    });
    await dataSource.initialize();
  });

  afterAll(async () => {
    await dataSource.destroy();
  });

  beforeEach(async () => {
    await dataSource.getRepository(StockTest).clear();
    await dataSource.getRepository(StockTest).save({
      id: 'TEST001',
      views: 0
    });
  });

  test('동시에 여러 요청이 들어올 경우 Race Condition 발생 가능성 확인', async () => {
    // Given
    const stockId = 'TEST001';
    const numberOfRequests = 200;

    const increaseView = async (stockId: string) => {
      await dataSource.transaction(async (manager) => {
        await manager.increment(StockTest, { id: stockId }, 'views', 1);
      });
    };

    // When: 100개의 동시 요청
    const promises = Array(numberOfRequests)
      .fill(null)
      .map(() => increaseView(stockId));

    await Promise.all(promises);

    // Then
    const updatedStock = await dataSource
      .getRepository(StockTest)
      .findOne({ where: { id: stockId } });

    console.log(`Expected views: ${numberOfRequests}, Actual views: ${updatedStock?.views}`);
    expect(updatedStock?.views).toBeLessThan(numberOfRequests);
  });
});