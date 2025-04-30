// messages.service.ts
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

  async createMessage(
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

    const participants = [project.client.id, project.assignedFreelancer?.id];

    if (!participants.includes(senderId)) {
      throw new ForbiddenException('You are not authorized to send messages');
    }

    if (!participants.includes(createMessageDto.receiverId)) {
      throw new ForbiddenException('Invalid receiver for this project');
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

    if (!project) throw new NotFoundException('Project not found');

    const participants = [project.client.id, project.assignedFreelancer?.id];
    if (!participants.includes(userId)) {
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

  async getUserProjects(userId: number, role: string) {
    if (role === 'client') {
      return this.projectRepository.find({
        where: { client: { id: userId } },
        relations: ['client', 'assignedFreelancer'],
        order: { created_at: 'DESC' },
      });
    } else if (role === 'freelancer') {
      return this.projectRepository.find({
        where: { assignedFreelancer: { id: userId } },
        relations: ['client', 'assignedFreelancer'],
        order: { created_at: 'DESC' },
      });
    } else {
      throw new ForbiddenException('Invalid role');
    }
  }
}
