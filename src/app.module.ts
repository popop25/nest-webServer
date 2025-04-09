import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { StocksModule } from './stocks/stocks.module';

@Module({
  imports: [AuthModule, StocksModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
