import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [PassportModule, JwtModule.register({}), ConfigModule],
  providers: [JwtStrategy, JwtAuthGuard],
  exports: [JwtAuthGuard],
})
export class AuthModule {}
