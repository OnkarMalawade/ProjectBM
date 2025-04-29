import { IsNotEmpty, IsEnum, IsNumber } from 'class-validator';

export class CreateInvoiceDto {
  @IsNotEmpty()
  projectId: number;

  @IsEnum(['pending', 'paid'])
  status: 'pending' | 'paid';
}
