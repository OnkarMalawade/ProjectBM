import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password_hash: string;

  @Column()
  role: string; // 'client' | 'freelancer'

  @Column({ type: 'text', nullable: true })
  bio: string;

  @Column({ nullable: true })
  profile_image: string;

  @CreateDateColumn()
  created_at: Date;
}
