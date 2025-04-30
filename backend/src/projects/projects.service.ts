import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './entities/project.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { User } from '../users/entities/user.entity';
import { IsNull } from 'typeorm';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private projectsRepository: Repository<Project>,

    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findAvailableProjects() {
    return this.projectsRepository.find({
      where: { assignedFreelancer: IsNull() },
      relations: ['client'],
    });
  }

  async create(createProjectDto: CreateProjectDto, clientPayload: any) {
    const client = await this.usersRepository.findOneBy({
      id: clientPayload.id,
    });

    if (!client) throw new NotFoundException('Client not found');

    const project = this.projectsRepository.create({
      ...createProjectDto,
      client,
    });

    return this.projectsRepository.save(project);
  }

  async findAll() {
    return this.projectsRepository.find({ relations: ['client'] });
  }

  async findOne(id: number) {
    const project = await this.projectsRepository.findOne({
      where: { id },
      relations: ['client'],
    });
    if (!project) {
      throw new NotFoundException('Project not found');
    }
    return project;
  }

  async update(id: number, updateProjectDto: UpdateProjectDto) {
    const project = await this.findOne(id);
    Object.assign(project, updateProjectDto);
    return this.projectsRepository.save(project);
  }

  async remove(id: number) {
    const project = await this.findOne(id);
    return this.projectsRepository.remove(project);
  }
}
