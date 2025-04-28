import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column()
  budget: number;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'assigned_freelancer_id' })
  assignedFreelancer: User | null; // Correct syntax

  @ManyToOne(() => User)
  @JoinColumn({ name: 'client_id' })
  client: User;

  @CreateDateColumn()
  created_at: Date;
}
