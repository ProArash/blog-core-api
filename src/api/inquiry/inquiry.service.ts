import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateInquiryDto } from './dto/create-inquery.dto';
import { InquiryEntity } from './entities/inquery.entity';

@Injectable()
export class InquiryService {
	constructor(
		@InjectRepository(InquiryEntity)
		private inquiryRepo: Repository<InquiryEntity>,
	) {}

	async newInquiry(data: CreateInquiryDto) {
		return await this.inquiryRepo.create(data).save();
	}

	async getAllInquiries(pageNumber: number) {
		const limit = 20;
		const skip = (pageNumber - 1) * limit;
		return await this.inquiryRepo.find({
			take: limit,
			skip,
		});
	}

	async getInquiryById(inquiryiId: number) {
		const inqery = await this.inquiryRepo.findOne({
			where: {
				id: inquiryiId,
			},
			relations: {
				attributes: true,
			},
		});
		if (!inqery) throw new NotFoundException('درخواست یافت نشد');
		return inqery;
	}

	async deleteInquiryById(inquiryiId: number) {
		const inqery = await this.getInquiryById(inquiryiId);
		await this.inquiryRepo.remove(inqery);
		return true;
	}
}
