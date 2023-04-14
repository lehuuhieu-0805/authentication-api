import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from './config/data-source.config';
import { AuthModule } from './components/auth/auth.module';
import { UserModule } from './components/user/user.module';

@Module({
  imports: [TypeOrmModule.forRoot(dataSourceOptions), AuthModule, UserModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
