import { PartialType } from '@nestjs/swagger';
import { CreateInquiryDto } from './create-inquery.dto';

export class UpdateInquiryDto extends PartialType(CreateInquiryDto) {}
