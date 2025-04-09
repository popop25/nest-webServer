import { Body, Controller, Get, Post } from '@nestjs/common';
import { StocksService } from './stocks.service';
import { CreateSaleDto } from './dto/create-sale.dto';

@Controller('v1/sales')
export class SalesController {
  constructor(private readonly stocksService: StocksService) {}

  @Post()
  createSale(@Body() createSaleDto: CreateSaleDto) {
    return this.stocksService.createSale(createSaleDto);
  }

  @Get()
  getAllSales() {
    return this.stocksService.getAllSales();
  }
}
