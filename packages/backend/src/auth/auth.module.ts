import { Module } from '@nestjs/common';
import { GoogleStrategy } from '@/auth/google.strategy';
import { GoogleAuthController } from '@/auth/googleAuth.controller';
import { GoogleAuthService } from '@/auth/googleAuth.service';
import { UserModule } from '@/user/user.module';

@Module({
  imports: [UserModule],
  controllers: [GoogleAuthController],
  providers: [GoogleStrategy, GoogleAuthService],
})
export class AuthModule {}
