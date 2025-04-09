import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateStockDto } from './dto/create-stock.dto';
import { CreateSaleDto } from './dto/create-sale.dto';

export interface Stock {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Sale {
  id: string;
  name: string;
  price: number;
  quantity: number;
  timestamp: Date;
}

@Injectable()
export class StocksService {
  private stocks: Map<string, Stock> = new Map();
  private sales: Sale[] = [];

  createOrUpdateStock(createStockDto: CreateStockDto): Stock {
    const stock: Stock = {
      id: createStockDto.id,
      name: createStockDto.name,
      price: createStockDto.price,
      quantity: createStockDto.quantity,
    };

    this.stocks.set(stock.id, stock);
    return stock;
  }

  getAllStocks(): Stock[] {
    return Array.from(this.stocks.values());
  }

  getStockById(id: string): Stock {
    const stock = this.stocks.get(id);
    if (!stock) {
      throw new NotFoundException(`Stock with ID ${id} not found`);
    }
    return stock;
  }

  createSale(createSaleDto: CreateSaleDto): Sale {
    const stock = this.stocks.get(createSaleDto.id);
    if (!stock) {
      throw new NotFoundException(
        `Stock with ID ${createSaleDto.id} not found`,
      );
    }

    if (stock.quantity < createSaleDto.quantity) {
      throw new NotFoundException(
        `Not enough stock. Available: ${stock.quantity}`,
      );
    }

    // Update stock quantity
    stock.quantity -= createSaleDto.quantity;
    this.stocks.set(stock.id, stock);

    // Create and record the sale
    const sale: Sale = {
      id: stock.id,
      name: stock.name,
      price: stock.price,
      quantity: createSaleDto.quantity,
      timestamp: new Date(),
    };

    this.sales.push(sale);
    return sale;
  }

  getAllSales(): Sale[] {
    return this.sales;
  }

  deleteAllStocks(): void {
    this.stocks.clear();
  }
}
