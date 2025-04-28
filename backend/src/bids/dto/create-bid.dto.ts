import { IsNotEmpty, IsNumber, Min, MaxLength } from 'class-validator';

export class CreateBidDto {
  @IsNumber()
  @Min(1)
  amount: number;

  @IsNumber()
  @Min(1)
  duration_days: number;

  @IsNotEmpty()
  @MaxLength(1000)
  message: string;

  @IsNumber()
  projectId: number;
}
