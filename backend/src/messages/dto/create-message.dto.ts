import { IsNotEmpty, IsNumber, MaxLength, IsOptional } from 'class-validator';
import { Express } from 'express';

export class CreateMessageDto {
  @IsNumber()
  receiverId: number;

  @IsNotEmpty()
  @MaxLength(2000)
  content: string;

  @IsOptional()
  files?: Express.Multer.File[];
}
