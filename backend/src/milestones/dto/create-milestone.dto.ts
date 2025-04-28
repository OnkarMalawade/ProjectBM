import { IsNotEmpty, IsNumber, IsDateString } from 'class-validator';

export class CreateMilestoneDto {
  @IsNotEmpty()
  title: string;

  @IsDateString()
  due_date: string;

  @IsNumber()
  amount: number;

  @IsNumber()
  projectId: number;
}
