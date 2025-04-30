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
  ParseIntPipe,
  BadRequestException,
  Req,
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
  async uploadMessageWithFiles(
    @Param('projectId', ParseIntPipe) projectId: number,
    @Req() req: any,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    const { receiverId, content } = req.body;

    if (!receiverId || !content) {
      throw new BadRequestException('Missing receiverId or content');
    }

    const dto: CreateMessageDto = {
      receiverId: +receiverId,
      content,
    };

    return this.messagesService.createMessage(projectId, dto, req.user, files);
  }

  @Get('project/:projectId')
  async getMessages(
    @Param('projectId', ParseIntPipe) projectId: number,
    @Request() req,
  ) {
    return this.messagesService.getProjectMessages(projectId, req.user.id);
  }

  @Get('projects')
  async getUserProjects(@Request() req) {
    return this.messagesService.getUserProjects(req.user.id, req.user.role);
  }
}
