import { Module } from '@nestjs/common';
import { GoogleAuthController } from '@/auth/google/googleAuth.controller';
import { GoogleAuthService } from '@/auth/google/googleAuth.service';
import { GoogleStrategy } from '@/auth/google/strategy/google.strategy';
import { SessionSerializer } from '@/auth/session/session.serializer';
import { UserModule } from '@/user/user.module';

@Module({
  imports: [UserModule],
  controllers: [GoogleAuthController],
  providers: [GoogleStrategy, GoogleAuthService, SessionSerializer],
})
export class AuthModule {}
