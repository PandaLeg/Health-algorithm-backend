import { forwardRef, Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { UserModule } from '../user/user.module';
import { TokenService } from './services/token.service';
import { authProviders } from './auth.providers';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [forwardRef(() => UserModule), JwtModule.register({ global: true })],
  controllers: [AuthController],
  providers: [AuthService, TokenService, ...authProviders],
})
export class AuthModule {}
