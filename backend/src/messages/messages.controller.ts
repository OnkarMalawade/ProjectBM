import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Request,
  UseGuards,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { AuthGuard } from '@nestjs/passport';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';

@Controller('messages')
@UseGuards(AuthGuard('jwt'))
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post('upload/:projectId')
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix = uuidv4();
          cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async sendMessageWithFiles(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() createMessageDto: CreateMessageDto,
    @Request() req,
    @Param('projectId') projectId: number, // 🟢 inject from URL
  ) {
    return this.messagesService.sendMessage(
      +projectId,
      createMessageDto,
      req.user,
      files,
    );
  }

  @Get('project/:projectId')
  async getMessages(@Param('projectId') projectId: number, @Request() req) {
    return this.messagesService.getProjectMessages(+projectId, req.user.id);
  }
}
