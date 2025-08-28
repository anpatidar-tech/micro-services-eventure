// apps/api-gateway/src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }), 
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'superSecretKey',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [JwtStrategy],
  exports: [PassportModule, JwtModule, JwtStrategy], // 👈 Added JwtModule
})
export class AuthModule {}
