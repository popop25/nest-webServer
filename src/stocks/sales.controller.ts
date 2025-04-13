import { Controller, Get, Post, Body, Res, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { StocksService } from './stocks.service';
import { CreateSaleDto } from './dto/create-sale.dto';
import { ErrorDto } from './dto/error.dto';

@Controller('v1/sales')
export class SalesController {
  constructor(private readonly stocksService: StocksService) {}

  // (3) 판매 API
  @Post()
  createSale(@Body() createSaleDto: CreateSaleDto, @Res() res: Response) {
    try {
      const result = this.stocksService.createSale(createSaleDto);

      // Location 헤더 설정
      res.setHeader(
        'Location',
        `${res.req.headers.host}/v1/sales/${result.name}`,
      );

      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      if (error?.response?.message === 'ERROR') {
        return res.status(HttpStatus.OK).json({ message: 'ERROR' });
      }
      return res.status(HttpStatus.OK).json({ message: 'ERROR' });
    }
  }

  @Get()
  getTotalSales(@Res() res: Response) {
    try {
      const { sales } = this.stocksService.getTotalSales();

      // 숫자 형식으로 반환하면서 정수인 경우 .0 붙이기
      let jsonStr;
      if (Number.isInteger(sales)) {
        jsonStr = `{"sales":${sales}.0}`;
      } else {
        jsonStr = `{"sales":${sales}}`;
      }

      return res.status(HttpStatus.OK).type('application/json').send(jsonStr);
    } catch (error) {
      return res.status(HttpStatus.OK).json({ message: 'ERROR' });
    }
  }
}
