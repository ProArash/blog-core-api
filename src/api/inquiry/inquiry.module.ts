import { Module } from '@nestjs/common';
import { InquiryService } from './inquiry.service';
import { InquiryController } from './inquiry.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AttributeEntity } from './entities/attribute.entity';
import { UserModule } from '../user/user.module';
import { InquiryEntity } from './entities/inquery.entity';

@Module({
	imports: [
		TypeOrmModule.forFeature([InquiryEntity, AttributeEntity]),
		UserModule,
	],
	controllers: [InquiryController],
	providers: [InquiryService],
})
export class InquiryModule {}
