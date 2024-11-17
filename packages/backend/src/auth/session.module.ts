import { Module } from '@nestjs/common';
import { MemoryStore } from 'express-session';

export const MEMORY_STORE = 'memoryStore';

@Module({
  providers: [
    {
      provide: MEMORY_STORE,
      useFactory: () => {
        return new MemoryStore();
      },
    },
  ],
  exports: [MEMORY_STORE],
})
export class SessionModule {}
