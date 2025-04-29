import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bid, BidStatus } from './entities/bid.entity';
import { CreateBidDto } from './dto/create-bid.dto';
import { User } from '../users/entities/user.entity';
import { Project } from '../projects/entities/project.entity';

@Injectable()
export class BidsService {
  constructor(
    @InjectRepository(Bid)
    private bidsRepository: Repository<Bid>,

    @InjectRepository(Project)
    private projectsRepository: Repository<Project>,
  ) {}

  async create(createBidDto: CreateBidDto, freelancerId: number) {
    const project = await this.projectsRepository.findOne({
      where: { id: createBidDto.projectId },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    const freelancer = new User(); // 👈 build user reference manually
    freelancer.id = freelancerId;

    const bid = this.bidsRepository.create({
      amount: createBidDto.amount,
      duration_days: createBidDto.duration_days,
      message: createBidDto.message,
      project,
      freelancer,
      status: BidStatus.PENDING,
    });

    return this.bidsRepository.save(bid);
  }

  async findByFreelancer(freelancerId: number) {
    return this.bidsRepository.find({
      where: { freelancer: { id: freelancerId } },
      relations: ['project'],
    });
  }

  async findByStatus(freelancerId: number, status: BidStatus) {
    return this.bidsRepository.find({
      where: { freelancer: { id: freelancerId }, status },
      relations: ['project', 'freelancer'],
      select: {
        id: true,
        amount: true,
        duration_days: true,
        message: true,
        status: true,
        created_at: true,
        project: {
          id: true,
          title: true,
          description: true,
          budget: true, // Ensure budget is part of the Project entity
        },
        freelancer: {
          name: true,
          email: true,
        },
      },
    });
  }

  async acceptBid(bidId: number, clientId: number) {
    const bid = await this.bidsRepository.findOne({
      where: { id: bidId },
      relations: ['project', 'freelancer', 'project.client'],
    });

    if (!bid) {
      throw new NotFoundException('Bid not found');
    }

    const project = bid.project;

    if (project.client.id !== clientId) {
      throw new ForbiddenException('You are not authorized to accept this bid');
    }

    // Update accepted bid
    bid.status = BidStatus.ACCEPTED; // ✅ use enum
    await this.bidsRepository.save(bid);

    // Update project
    project.assignedFreelancer = bid.freelancer;
    await this.projectsRepository.save(project);

    // Set other bids as pending
    await this.bidsRepository
      .createQueryBuilder()
      .update(Bid)
      .set({ status: BidStatus.PENDING }) // ✅ use enum
      .where('project_id = :projectId AND id != :bidId', {
        projectId: project.id,
        bidId: bid.id,
      })
      .execute();

    return { message: 'Bid accepted and freelancer assigned to project' };
  }

  async findByProject(projectId: number, clientId: number) {
    const project = await this.projectsRepository.findOne({
      where: { id: projectId },
      relations: ['client'],
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    if (project.client.id !== clientId) {
      throw new ForbiddenException(
        'You are not allowed to view bids on this project',
      );
    }

    return this.bidsRepository.find({
      where: { project: { id: projectId } },
      relations: ['freelancer'],
    });
  }
}
