import { IsNotEmpty, IsNumber, Min } from 'class-validator';

export class CreateProjectDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  description: string;

  @IsNumber()
  @Min(0)
  budget: number;
}
