import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bid } from './entities/bid.entity';
import { Project } from '../projects/entities/project.entity';
import { BidsService } from './bids.service';
import { BidsController } from './bids.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Bid, Project])],
  controllers: [BidsController],
  providers: [BidsService],
})
export class BidsModule {}
