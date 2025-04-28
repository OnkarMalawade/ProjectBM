import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Milestone } from './entities/milestone.entity';
import { CreateMilestoneDto } from './dto/create-milestone.dto';
import { Project } from '../projects/entities/project.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class MilestonesService {
  constructor(
    @InjectRepository(Milestone)
    private milestoneRepository: Repository<Milestone>,

    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
  ) {}

  async createMilestone(createMilestoneDto: CreateMilestoneDto, user: User) {
    const project = await this.projectRepository.findOne({
      where: { id: createMilestoneDto.projectId },
      relations: ['client'],
    });

    if (!project) throw new NotFoundException('Project not found');
    if (project.client.id !== user.id)
      throw new ForbiddenException('You are not authorized to add milestones');

    const milestone = this.milestoneRepository.create({
      ...createMilestoneDto,
      project,
    });

    return this.milestoneRepository.save(milestone);
  }

  async getProjectMilestones(projectId: number) {
    return this.milestoneRepository.find({
      where: { project: { id: projectId } },
      order: { due_date: 'ASC' },
    });
  }
}
