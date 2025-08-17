import { Module } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { InvoiceController } from './invoice.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InvoiceEntity } from './entities/invoice.entity';
import { UserModule } from '../user/user.module';
import { PlanModule } from '../plan/plan.module';

@Module({
	imports: [TypeOrmModule.forFeature([InvoiceEntity]), UserModule, PlanModule],
	controllers: [InvoiceController],
	providers: [InvoiceService],
})
export class InvoiceModule {}
