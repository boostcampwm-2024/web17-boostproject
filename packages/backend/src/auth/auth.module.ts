import { Module } from '@nestjs/common';
import { GoogleAuthController } from '@/auth/googleAuth.controller';
import { GoogleAuthService } from '@/auth/googleAuth.service';
import { GoogleStrategy } from '@/auth/passport/google.strategy';
import { SessionSerializer } from '@/auth/passport/session.serializer';
import { UserModule } from '@/user/user.module';

@Module({
  imports: [UserModule],
  controllers: [GoogleAuthController],
  providers: [GoogleStrategy, GoogleAuthService, SessionSerializer],
})
export class AuthModule {}
