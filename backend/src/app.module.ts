import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/ormconfig';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ProjectsModule } from './projects/projects.module';
import { BidsModule } from './bids/bids.module';
import { MessagesModule } from './messages/messages.module';
import { MilestonesModule } from './milestones/milestones.module';
import { InvoicesModule } from './invoices/invoices.module';
import { UploadsModule } from './uploads/uploads.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    AuthModule,
    UsersModule,
    ProjectsModule,
    BidsModule,
    MessagesModule,
    MilestonesModule,
    InvoicesModule,
    UploadsModule,
  ],
})
export class AppModule {}
