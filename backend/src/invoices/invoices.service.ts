import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Invoice } from './entities/invoice.entity';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { Milestone } from '../milestones/entities/milestone.entity';

@Injectable()
export class InvoicesService {
  constructor(
    @InjectRepository(Invoice)
    private invoiceRepository: Repository<Invoice>,

    @InjectRepository(Milestone)
    private milestoneRepository: Repository<Milestone>,
  ) {}

  async createInvoice(createInvoiceDto: CreateInvoiceDto) {
    const milestone = await this.milestoneRepository.findOne({
      where: { id: createInvoiceDto.milestoneId },
    });

    if (!milestone) throw new NotFoundException('Milestone not found');

    const invoice = this.invoiceRepository.create({
      milestone,
      amount: milestone.amount,
      issue_date: new Date().toISOString().split('T')[0], // Today's date
    });

    return this.invoiceRepository.save(invoice);
  }

  async getInvoicesByMilestone(milestoneId: number) {
    return this.invoiceRepository.find({
      where: { milestone: { id: milestoneId } },
    });
  }
}
