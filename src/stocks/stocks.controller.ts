import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { StocksService } from './stocks.service';
import { CreateStockDto } from './dto/create-stock.dto';

@Controller('v1/stocks')
export class StocksController {
  constructor(private readonly stocksService: StocksService) {}

  @Post()
  createOrUpdateStock(@Body() createStockDto: CreateStockDto) {
    return this.stocksService.createOrUpdateStock(createStockDto);
  }

  @Get()
  getAllStocks() {
    return this.stocksService.getAllStocks();
  }

  @Get(':id')
  getStockById(@Param('id') id: string) {
    return this.stocksService.getStockById(id);
  }

  @Delete()
  deleteAllStocks() {
    return this.stocksService.deleteAllStocks();
  }
}
