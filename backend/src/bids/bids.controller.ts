// src/bids/bids.controller.ts
import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Request,
  Param,
  Patch,
} from '@nestjs/common';
import { BidsService } from './bids.service';
import { CreateBidDto } from './dto/create-bid.dto';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { BidStatus } from './entities/bid.entity';

@Controller('bids')
export class BidsController {
  constructor(private readonly bidsService: BidsService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('freelancer')
  create(@Body() createBidDto: CreateBidDto, @Request() req) {
    return this.bidsService.create(createBidDto, req.user.id); // 👈 use `id`
  }

  @Patch(':bidId/accept')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('client')
  acceptBid(@Param('bidId') bidId: string, @Request() req) {
    return this.bidsService.acceptBid(+bidId, req.user.id); // 👈 use `id`
  }

  @Get('freelancer/accepted')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('freelancer')
  findAcceptedBids(@Request() req) {
    return this.bidsService.findByStatus(req.user.id, BidStatus.ACCEPTED); // 👈
  }

  @Get('freelancer/remaining')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('freelancer')
  findRemainingBids(@Request() req) {
    return this.bidsService.findByStatus(req.user.id, BidStatus.PENDING); // 👈
  }

  @Get('freelancer')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('freelancer')
  findFreelancerBids(@Request() req) {
    return this.bidsService.findByFreelancer(req.user.id); // 👈
  }

  @Get('project/:projectId')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('client')
  findProjectBids(@Param('projectId') projectId: string, @Request() req) {
    return this.bidsService.findByProject(+projectId, req.user.id); // 👈
  }
}
