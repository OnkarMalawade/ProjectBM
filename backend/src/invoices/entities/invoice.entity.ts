import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Milestone } from '../../milestones/entities/milestone.entity';

@Entity('invoices')
export class Invoice {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('float')
  amount: number;

  @Column({ type: 'date' })
  issue_date: string;

  @Column({ default: 'unpaid' })
  status: string;

  @ManyToOne(() => Milestone)
  @JoinColumn({ name: 'milestone_id' })
  milestone: Milestone;
}
