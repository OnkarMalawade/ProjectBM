import { IsOptional, IsNotEmpty, IsNumber, Min } from 'class-validator';

export class UpdateProjectDto {
  @IsOptional()
  @IsNotEmpty()
  title?: string;

  @IsOptional()
  @IsNotEmpty()
  description?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  budget?: number;
}
