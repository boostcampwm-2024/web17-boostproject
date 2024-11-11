import { Module } from '@nestjs/common';
import { GoogleAuthController } from '@/auth/googleAuth.controller';
import { GoogleStrategy } from '@/auth/google.strategy';

@Module({
  controllers: [GoogleAuthController],
  providers: [GoogleStrategy],
})
export class AuthModule {}