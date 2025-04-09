import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { StocksModule } from './stocks/stocks.module';

@Module({
  imports: [AuthModule, StocksModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
