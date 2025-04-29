// src/projects/projects.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from './entities/project.entity';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { User } from '../users/entities/user.entity';
import { Invoice } from '../invoices/entities/invoice.entity';
import { Milestone } from '../milestones/entities/milestone.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Project,
      User,
      Invoice, // ✅ Add this
      Milestone, // ✅ And this (if missing)
    ]),
  ],
  controllers: [ProjectsController],
  providers: [ProjectsService],
})
export class ProjectsModule {}
