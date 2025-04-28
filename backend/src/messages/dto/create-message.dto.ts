import { IsNotEmpty, IsNumber, MaxLength } from 'class-validator';

export class CreateMessageDto {
  @IsNumber()
  receiverId: number;

  @IsNumber()
  projectId: number;

  @IsNotEmpty()
  @MaxLength(2000)
  content: string;
}
