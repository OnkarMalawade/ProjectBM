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

@Controller('bids')
export class BidsController {
  constructor(private readonly bidsService: BidsService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('freelancer')
  create(@Body() createBidDto: CreateBidDto, @Request() req) {
    return this.bidsService.create(createBidDto, req.user);
  }

  @Patch(':bidId/accept')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('client')
  acceptBid(@Param('bidId') bidId: string, @Request() req) {
    return this.bidsService.acceptBid(+bidId, req.user.id);
  }

  @Get('freelancer')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('freelancer')
  findFreelancerBids(@Request() req) {
    return this.bidsService.findByFreelancer(req.user.id);
  }

  @Get('project/:projectId')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('client')
  findProjectBids(@Param('projectId') projectId: string, @Request() req) {
    return this.bidsService.findByProject(+projectId, req.user.id);
  }
}
