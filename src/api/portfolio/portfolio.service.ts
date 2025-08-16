import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PortfolioEntity } from './entities/portfolio.entity';
import { Repository } from 'typeorm';
import { CreatePortfolioDto } from './dto/create-portfolio.dto';
import { MediaService } from '../media/media.service';

@Injectable()
export class PortfolioService {
	constructor(
		@InjectRepository(PortfolioEntity)
		private repo: Repository<PortfolioEntity>,
		private mediaService: MediaService,
	) {}

	async create(data: CreatePortfolioDto, fileUrl: string) {
		const portfolio = await this.repo.create(data).save();
		await this.mediaService.newPortfolioMedia(fileUrl, portfolio);
		return true;
	}

	async getAll(page: number) {
		const limit = 10;
		const skip = (page - 1) * limit;
		return await this.repo.find({
			take: limit,
			skip,
			relations: {
				medias: true,
			},
		});
	}
	async deleteById(id: number) {
		await this.mediaService.deleteAllPortfolioById(id);
		await this.repo.delete(id);
		return true;
	}
}
