import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Project } from '../../projects/entities/project.entity';

export enum BidStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
}

@Entity('bids')
export class Bid {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('float')
  amount: number;

  @Column('int')
  duration_days: number;

  @Column('text')
  message: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'freelancer_id' })
  freelancer: User;

  @ManyToOne(() => Project)
  @JoinColumn({ name: 'project_id' })
  project: Project;

  @CreateDateColumn()
  created_at: Date;

  @Column({ type: 'enum', enum: BidStatus, default: BidStatus.PENDING })
  status: BidStatus;
}
