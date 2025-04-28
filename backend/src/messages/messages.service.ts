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

  async sendMessage(createMessageDto: CreateMessageDto, sender: User) {
    const project = await this.projectRepository.findOne({
      where: { id: createMessageDto.projectId },
      relations: ['client', 'assignedFreelancer'],
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    // Authorization: Only client or assigned freelancer can send messages
    if (
      project.client.id !== sender.id &&
      project.assignedFreelancer?.id !== sender.id
    ) {
      throw new ForbiddenException(
        'You are not authorized to send a message on this project',
      );
    }

    const message = this.messageRepository.create({
      content: createMessageDto.content,
      sender,
      receiver: { id: createMessageDto.receiverId } as User,
      project,
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

    // Authorization: Only client or assigned freelancer can view messages
    if (
      project.client.id !== userId &&
      project.assignedFreelancer?.id !== userId
    ) {
      throw new ForbiddenException(
        'You are not authorized to view messages of this project',
      );
    }

    return this.messageRepository.find({
      where: { project: { id: projectId } },
      relations: ['sender', 'receiver'],
      order: { created_at: 'ASC' },
    });
  }
}
