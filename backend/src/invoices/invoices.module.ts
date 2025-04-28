import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InvoicesService } from './invoices.service';
import { InvoicesController } from './invoices.controller';
import { Invoice } from './entities/invoice.entity';
import { Milestone } from '../milestones/entities/milestone.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Invoice, Milestone])],
  controllers: [InvoicesController],
  providers: [InvoicesService],
})
export class InvoicesModule {}
