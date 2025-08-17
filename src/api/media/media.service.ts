import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MediaEntity } from './entities/media.entity';
import { Repository } from 'typeorm';
import { promises as fs } from 'fs';
import { join } from 'path';
import { PlanEntity } from '../plan/entities/plan.entity';
import { PortfolioEntity } from '../portfolio/entities/portfolio.entity';

@Injectable()
export class MediaService {
	constructor(
		@InjectRepository(MediaEntity)
		private mediaRepo: Repository<MediaEntity>,
	) {}
	async newPlanMedias(mediaUrl: string[], plan: PlanEntity) {
		const medias = mediaUrl.map((media) =>
			this.mediaRepo.create({ url: media, plan }),
		);
		await this.mediaRepo.save(medias);
		return true;
	}
	async newPortfolioMedia(mediaUrl: string, portfolio: PortfolioEntity) {
		const media = await this.mediaRepo.create({ url: mediaUrl, portfolio }).save();
		return media;
	}

	async deleteAllMediaByPlanId(planId: number) {
		const medias = await this.mediaRepo.find({
			where: {
				plan: {
					id: planId,
				},
			},
		});
		await Promise.all(
			medias.map(async (m) => {
				try {
					await fs.unlink(
						join(__dirname, '..', '..', '..', m.url.replace(/^\//, '')),
					);
				} catch (error) {
					console.log(error);
				}
			}),
		);
		await this.mediaRepo.remove(medias);
		return true;
	}

	async deleteAllPortfolioById(id: number) {
		const medias = await this.mediaRepo.find({
			where: {
				portfolio: {
					id: id,
				},
			},
		});
		await Promise.all(
			medias.map(async (m) => {
				try {
					await fs.unlink(
						join(__dirname, '..', '..', '..', m.url.replace(/^\//, '')),
					);
				} catch (error) {
					console.log(error);
				}
			}),
		);
		await this.mediaRepo.remove(medias);
		return true;
	}

	async getMediaById(mediaId: number) {
		const media = await this.mediaRepo.findOne({
			where: {
				id: mediaId,
			},
		});
		if (!media) throw new NotFoundException('رسانه یافت نشد');
		return media;
	}

	async deleteMediaById(mediaId: number) {
		const media = await this.getMediaById(mediaId);
		await this.mediaRepo.remove(media);
		return true;
	}
}
