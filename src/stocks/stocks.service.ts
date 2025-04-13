import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateStockDto } from './dto/create-stock.dto';
import { CreateSaleDto } from './dto/create-sale.dto';

@Injectable()
export class StocksService {
  // 인메모리 데이터베이스
  private stocks: Record<string, number> = {};
  private totalSales: number = 0;

  // 유효성 검사 함수
  validateName(name: string): boolean {
    if (!name || typeof name !== 'string') return false;
    if (name.length > 8) return false;
    return /^[a-zA-Z]+$/.test(name);
  }

  validateAmount(amount: number): boolean {
    if (amount === undefined) return true; // 옵션 파라미터인 경우 1로 설정
    if (typeof amount !== 'number') return false;
    if (!Number.isInteger(amount) || amount <= 0) return false;
    return true;
  }

  validatePrice(price: number): boolean {
    if (price === undefined) return true; // 옵션 파라미터
    if (typeof price !== 'number') return false;
    if (price <= 0) return false;
    return true;
  }

  // (1) 재고 추가
  createStock(createStockDto: CreateStockDto): {
    name: string;
    amount: number;
  } {
    const { name, amount = 1 } = createStockDto;

    // 유효성 검사
    if (!this.validateName(name)) {
      throw new BadRequestException({ message: 'ERROR' });
    }

    if (!this.validateAmount(amount)) {
      throw new BadRequestException({ message: 'ERROR' });
    }

    // 재고 추가
    if (!this.stocks[name]) {
      this.stocks[name] = 0;
    }
    this.stocks[name] += amount;

    return { name, amount };
  }

  // (2) 특정 상품 재고 확인
  getStock(name: string): Record<string, number> {
    // 유효성 검사
    if (!this.validateName(name)) {
      throw new BadRequestException({ message: 'ERROR' });
    }

    const result: Record<string, number> = {};
    result[name] = this.stocks[name] || 0;

    return result;
  }

  // (2) 모든 상품 재고 확인
  getAllStocks(): Record<string, number> {
    const result: Record<string, number> = {};

    // 재고가 있는 상품만 필터링하고 정렬
    Object.keys(this.stocks)
      .filter((name) => this.stocks[name] > 0)
      .sort()
      .forEach((name) => {
        result[name] = this.stocks[name];
      });

    return result;
  }

  // (3) 판매
  createSale(createSaleDto: CreateSaleDto): { name: string; amount: number } {
    const { name, amount = 1, price } = createSaleDto;

    // 유효성 검사
    if (!this.validateName(name)) {
      throw new BadRequestException({ message: 'ERROR' });
    }

    if (!this.validateAmount(amount)) {
      throw new BadRequestException({ message: 'ERROR' });
    }

    if (price !== undefined && !this.validatePrice(price)) {
      throw new BadRequestException({ message: 'ERROR' });
    }

    // 재고 확인
    if (!this.stocks[name] || this.stocks[name] < amount) {
      throw new BadRequestException({ message: 'ERROR' });
    }

    // 재고 감소
    this.stocks[name] -= amount;

    // 매출 증가 (price가 지정된 경우)
    if (price !== undefined) {
      this.totalSales += price * amount;
    }

    return { name, amount };
  }

  // (4) 매출 확인
  getTotalSales(): { sales: number } {
    // 소수점 둘째 자리까지 표시 (올림)
    let roundedSales = this.totalSales;
    if (
      Number.isFinite(this.totalSales) &&
      !Number.isInteger(this.totalSales)
    ) {
      roundedSales = Math.ceil(this.totalSales * 100) / 100;
    }

    return { sales: roundedSales };
  }

  // (5) 전체 삭제
  deleteAll(): void {
    this.stocks = {};
    this.totalSales = 0;
  }
}
