import {
  Controller,
  Post,
  Body,
  Param,
  Get,
  UseGuards,
  Request,
} from '@nestjs/common';
import { InvoicesService } from './invoices.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard'; // You must have this guard

import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';

@Controller('invoices')
@UseGuards(JwtAuthGuard, RolesGuard)
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  @Post('accept')
  @Roles('client')
  createAccepted(@Body() dto: CreateInvoiceDto) {
    return this.invoicesService.createInvoice({ ...dto, status: 'paid' });
  }

  @Post('pending')
  @Roles('client')
  createPending(@Body() dto: CreateInvoiceDto) {
    return this.invoicesService.createInvoice({ ...dto, status: 'pending' });
  }

  @Post(':id/paid')
  @Roles('client')
  markPaid(@Param('id') id: string) {
    return this.invoicesService.markAsPaid(+id);
  }

  @Get()
  @Roles('freelancer')
  findFreelancerInvoices(@Request() req) {
    return this.invoicesService.findByFreelancerId(req.user.id);
  }
}
