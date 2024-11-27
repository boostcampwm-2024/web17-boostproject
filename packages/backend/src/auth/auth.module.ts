import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { GoogleAuthController } from '@/auth/google/googleAuth.controller';
import { GoogleAuthService } from '@/auth/google/googleAuth.service';
import { GoogleStrategy } from '@/auth/google/strategy/google.strategy';
import { LogoutController } from '@/auth/session/logout.controller';
import { SessionSerializer } from '@/auth/session/session.serializer';
import { TesterStrategy } from '@/auth/tester/strategy/tester.strategy';
import { TesterAuthController } from '@/auth/tester/testerAuth.controller';
import { TesterAuthService } from '@/auth/tester/testerAuth.service';
import { UserModule } from '@/user/user.module';

@Module({
  imports: [UserModule, PassportModule.register({ session: true })],
  controllers: [GoogleAuthController, TesterAuthController, LogoutController],
  providers: [
    GoogleStrategy,
    GoogleAuthService,
    SessionSerializer,
    TesterAuthService,
    TesterStrategy,
  ],
})
export class AuthModule {}
