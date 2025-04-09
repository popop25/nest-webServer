import { Module } from '@nestjs/common';
import { StocksController } from './stocks.controller';
import { SalesController } from './sales/sales.controller';
import { StocksService } from './stocks.service';

@Module({
  controllers: [StocksController, SalesController],
  providers: [StocksService]
})
export class StocksModule {}
