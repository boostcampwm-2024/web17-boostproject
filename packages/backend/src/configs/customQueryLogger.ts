// custom-logger.ts
import { Logger as TypeORMLogger, QueryRunner } from 'typeorm';
import { Logger } from '@nestjs/common';
import { highlight } from 'sql-highlight';
import { format } from 'sql-formatter';

export class CustomQueryLogger implements TypeORMLogger {
  private readonly logger = new Logger('QueryLogger');

  private formatQuery(query: string, parameters?: any[]): string {
    let formattedQuery = format(query, {
      language: 'mysql',
      keywordCase: 'upper'
    });

    if (parameters?.length) {
      // ? 를 찾아서 순서대로 파라미터 값으로 대체
      let parameterIndex = 0;
      formattedQuery = formattedQuery.replace(/\?/g, () => {
        const param = parameters[parameterIndex++];
        return typeof param === 'string' ? `'${param}'` : param;
      });
    }

    return formattedQuery;
  }

  logQuery(query: string, parameters?: any[], queryRunner?: QueryRunner) {
    // EXPLAIN 쿼리는 로깅하지 않음
    // 이미 logQueryPlan 여기에서 실행 계획을 출력했기 때문
    if (query.trim().toUpperCase().startsWith('EXPLAIN')) {
      return;
    }

    const formattedQuery = this.formatQuery(query, parameters);
    this.logger.debug('\n🔍 Query:');
    this.logger.debug(highlight(formattedQuery));

    // SELECT 쿼리에 대해서만 실행 계획 출력
    if (query.trim().toUpperCase().startsWith('SELECT') && queryRunner) {
      this.logQueryPlan(query, parameters, queryRunner);
    }
  }

  logQueryError(error: string, query: string, parameters?: any[]) {
    const formattedQuery = this.formatQuery(query, parameters);

    console.error('\n❌ Query Error:');
    console.error(highlight(formattedQuery));
    console.error('Error:', error);
  }

  logQuerySlow(time: number, query: string, parameters?: any[]) {
    const formattedQuery = this.formatQuery(query, parameters);

    console.warn(`\n⚠️ Slow Query (${time}ms):`);
    console.warn(highlight(formattedQuery));

    if (parameters?.length) {
      console.warn('Parameters:', parameters);
    }
  }

  logSchemaBuild(message: string) {
    this.logger.debug('\n🏗 Schema Build:', message);
  }

  logMigration(message: string) {
    this.logger.debug('\n🔄 Migration:', message);
  }

  log(level: 'log' | 'info' | 'warn', message: any) {
    switch (level) {
      case 'log':
        this.logger.debug('\nℹ️ Log:', message);
        break;
      case 'info':
        console.info('\nℹ️ Info:', message);
        break;
      case 'warn':
        console.warn('\n⚠️ Warning:', message);
        break;
    }
  }

  private async logQueryPlan(query: string, parameters?: any[], queryRunner?: QueryRunner) {
    try {
      // SELECT 쿼리인 경우에만 실행 계획 출력
      if (!query.trim().toUpperCase().startsWith('SELECT')) {
        this.logger.debug('\n📝 DML Query - No execution plan available');
        return;
      }

      // 파라미터 출력 추가
      if (parameters?.length) {
        this.logger.debug('\n📍 Parameters:', parameters);
      }

      const explainQuery = `EXPLAIN FORMAT=JSON ${query}`;
      const queryPlan = await queryRunner?.query(explainQuery, parameters);

      if (queryPlan && queryPlan.length > 0) {
        const parsedPlan = JSON.parse(queryPlan[0].EXPLAIN);
        this.logger.debug('\n📊 Query Plan:');
        this.logPlanSummary(parsedPlan.query_block);
      }
    } catch (error) {
      console.error('\n❌ Failed to get query plan:', error);
    }
  }

  private logPlanSummary(queryBlock: any) {
    try {
      // cost_info가 있는 경우에만 출력
      if (queryBlock?.cost_info?.query_cost) {
        this.logger.debug(`\nQuery Cost: ${queryBlock.cost_info.query_cost}`);
      }

      // nested_loop가 있는 경우에만 출력
      const nestedLoop = queryBlock?.ordering_operation?.nested_loop
        || queryBlock?.nested_loop
        || [];

      nestedLoop.forEach((loop: any) => {
        const table = loop.table;
        if (!table) return;

        this.logger.debug(`\nTable: ${table.table_name || 'Unknown'}`);
        this.logger.debug(`Access Type: ${table.access_type || 'Unknown'}`);
        this.logger.debug(`Rows Examined: ${table.rows_examined_per_scan || 0}`);
        this.logger.debug(`Filtered: ${table.filtered || 0}%`);

        if (table.possible_keys) {
          this.logger.debug(`Used Index: ${table.key || 'None'}`);
        }

        if (table.cost_info?.read_cost) {
          this.logger.debug(`Read Cost: ${table.cost_info.read_cost}`);
        }
      });
    } catch (error) {
      console.error('Error in logPlanSummary:', error);
    }
  }
}