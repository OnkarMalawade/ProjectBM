import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './entities/message.entity';
import { CreateMessageDto } from './dto/create-message.dto';
import { User } from '../users/entities/user.entity';
import { Project } from '../projects/entities/project.entity';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,

    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
  ) {}

  async sendMessage(
    projectId: number,
    createMessageDto: CreateMessageDto,
    sender: User,
    files: Express.Multer.File[] = [],
  ) {
    const senderId = sender.id;

    const project = await this.projectRepository.findOne({
      where: { id: projectId },
      relations: ['client', 'assignedFreelancer'],
    });

    if (!project) throw new NotFoundException('Project not found');

    const isAuthorized =
      project.client.id === senderId ||
      project.assignedFreelancer?.id === senderId;

    if (!isAuthorized) {
      throw new ForbiddenException(
        'You are not authorized to send a message on this project',
      );
    }

    const fileUrls = files.map((file) => `/uploads/${file.filename}`);

    const message = this.messageRepository.create({
      content: createMessageDto.content,
      sender: { id: senderId } as User,
      receiver: { id: createMessageDto.receiverId } as User,
      project,
      fileUrls,
    });

    return this.messageRepository.save(message);
  }

  async getProjectMessages(projectId: number, userId: number) {
    const project = await this.projectRepository.findOne({
      where: { id: projectId },
      relations: ['client', 'assignedFreelancer'],
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    const isAuthorized =
      project.client.id === userId || project.assignedFreelancer?.id === userId;

    if (!isAuthorized) {
      throw new ForbiddenException(
        'You are not authorized to view messages for this project',
      );
    }

    return this.messageRepository.find({
      where: { project: { id: projectId } },
      relations: ['sender', 'receiver'],
      order: { created_at: 'ASC' },
    });
  }
}
