import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Request,
  UseGuards,
} from '@nestjs/common';
import { MilestonesService } from './milestones.service';
import { CreateMilestoneDto } from './dto/create-milestone.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('milestones')
@UseGuards(AuthGuard('jwt'))
export class MilestonesController {
  constructor(private readonly milestonesService: MilestonesService) {}

  @Post()
  async create(@Body() createMilestoneDto: CreateMilestoneDto, @Request() req) {
    return this.milestonesService.createMilestone(createMilestoneDto, req.user);
  }

  @Get('project/:projectId')
  async findProjectMilestones(@Param('projectId') projectId: number) {
    return this.milestonesService.getProjectMilestones(+projectId);
  }
}
