import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { StocksService } from './stocks.service';
import { CreateStockDto } from './dto/create-stock.dto';
import { ErrorDto } from './dto/error.dto';

@Controller('v1/stocks')
export class StocksController {
  constructor(private readonly stocksService: StocksService) {}

  // (1) 재고 추가/갱신 API
  @Post()
  createStock(@Body() createStockDto: CreateStockDto, @Res() res: Response) {
    try {
      const result = this.stocksService.createStock(createStockDto);

      // Location 헤더 설정
      res.setHeader(
        'Location',
        `${res.req.headers.host}/v1/stocks/${result.name}`,
      );

      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      if (error?.response?.message === 'ERROR') {
        return res.status(HttpStatus.OK).json({ message: 'ERROR' });
      }
      return res.status(HttpStatus.OK).json({ message: 'ERROR' });
    }
  }

  // (2) 특정 상품 재고 확인 API
  @Get(':name')
  getStock(@Param('name') name: string, @Res() res: Response) {
    try {
      const result = this.stocksService.getStock(name);
      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      if (error?.response?.message === 'ERROR') {
        return res.status(HttpStatus.OK).json({ message: 'ERROR' });
      }
      return res.status(HttpStatus.OK).json({ message: 'ERROR' });
    }
  }

  // (2) 모든 상품 재고 확인 API
  @Get()
  getAllStocks(@Res() res: Response) {
    try {
      const result = this.stocksService.getAllStocks();
      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      return res.status(HttpStatus.OK).json({ message: 'ERROR' });
    }
  }

  // (5) 전체 삭제 API
  @Delete()
  deleteAll(@Res() res: Response) {
    try {
      this.stocksService.deleteAll();
      return res.status(HttpStatus.OK).send();
    } catch (error) {
      return res.status(HttpStatus.OK).json({ message: 'ERROR' });
    }
  }
}
