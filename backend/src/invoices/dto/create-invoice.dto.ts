import { IsNumber } from 'class-validator';

export class CreateInvoiceDto {
  @IsNumber()
  milestoneId: number;
}
