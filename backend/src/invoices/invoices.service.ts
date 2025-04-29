import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Invoice } from './entities/invoice.entity';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { Project } from '../projects/entities/project.entity';

@Injectable()
export class InvoicesService {
  constructor(
    @InjectRepository(Invoice)
    private invoiceRepo: Repository<Invoice>,
    @InjectRepository(Project)
    private projectRepo: Repository<Project>,
  ) {}

  async createInvoice(dto: CreateInvoiceDto) {
    const project = await this.projectRepo.findOne({
      where: { id: dto.projectId },
      relations: ['client', 'assignedFreelancer'],
    });

    if (!project || !project.assignedFreelancer) {
      throw new NotFoundException('Project or assigned freelancer not found');
    }

    const invoice = this.invoiceRepo.create({
      project,
      client: project.client,
      freelancer: project.assignedFreelancer,
      amount: project.budget,
      status: dto.status,
    });

    return this.invoiceRepo.save(invoice);
  }

  async markAsPaid(id: number) {
    const invoice = await this.invoiceRepo.findOneBy({ id });
    if (!invoice) throw new NotFoundException('Invoice not found');

    invoice.status = 'paid';
    return this.invoiceRepo.save(invoice);
  }

  async findByFreelancerId(freelancerId: number) {
    return this.invoiceRepo.find({
      where: { freelancer: { id: freelancerId } },
      relations: ['project', 'client', 'freelancer'],
    });
  }

  async findAll() {
    return this.invoiceRepo.find({
      relations: ['project', 'client', 'freelancer'],
    });
  }
}
