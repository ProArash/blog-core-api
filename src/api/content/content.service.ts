import { ContentSkill } from '@/api/content/entities/content-skill.entity';
import { Content } from '@/api/content/entities/content.entity';
import { Media, MediaType } from '@/api/media/entities/media.entity';
import {
	BadRequestException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { existsSync, mkdirSync, unlinkSync } from 'fs';
import { join, parse } from 'path';
import sharp from 'sharp';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import {
	ContentResponseDto,
	CreateContentDto,
	UpdateContentDto,
} from './dto/create-content.dto';

@Injectable()
export class ContentService {
	constructor(
		@InjectRepository(Content)
		private readonly contentRepository: Repository<Content>,

		@InjectRepository(ContentSkill)
		private readonly contentSkillRepository: Repository<ContentSkill>,

		@InjectRepository(Media)
		private readonly mediaRepository: Repository<Media>,
	) {}

	async create(createContentDto: CreateContentDto) {
		const content = this.contentRepository.create({
			footer_links: createContentDto.footer.links,
			footer_caption: createContentDto.footer.caption,
			footer_mobile: createContentDto.footer.mobile,
			footer_email: createContentDto.footer.email,
			footer_telegram: createContentDto.footer.telegram,
			footer_whatsapp: createContentDto.footer.whatsapp,
			header_h1_title: createContentDto.header.h1_title,
			header_caption: createContentDto.header.caption,
			skills:
				createContentDto.skills?.map((skill) =>
					this.contentSkillRepository.create(skill),
				) ?? [],
		});

		const savedContent = await this.contentRepository.save(content);

		return this.findOne(savedContent.id);
	}

	async findAll() {
		const contents = await this.contentRepository.find({
			relations: {
				footer_logo: true,
				header_avatar_image: true,
				header_slider_images: true,
				skills: true,
			},
			order: {
				id: 'DESC',
			},
		});

		return contents.map((content) => this.toResponse(content));
	}

	async findOne(id: number) {
		const content = await this.findEntity(id);

		return this.toResponse(content);
	}

	async update(id: number, updateContentDto: UpdateContentDto) {
		const content = await this.findEntity(id);

		if (updateContentDto.footer) {
			if (updateContentDto.footer.links !== undefined) {
				content.footer_links = updateContentDto.footer.links;
			}

			if (updateContentDto.footer.caption !== undefined) {
				content.footer_caption = updateContentDto.footer.caption;
			}

			if (updateContentDto.footer.mobile !== undefined) {
				content.footer_mobile = updateContentDto.footer.mobile;
			}

			if (updateContentDto.footer.email !== undefined) {
				content.footer_email = updateContentDto.footer.email;
			}

			if (updateContentDto.footer.telegram !== undefined) {
				content.footer_telegram = updateContentDto.footer.telegram;
			}

			if (updateContentDto.footer.whatsapp !== undefined) {
				content.footer_whatsapp = updateContentDto.footer.whatsapp;
			}
		}

		if (updateContentDto.header) {
			if (updateContentDto.header.h1_title !== undefined) {
				content.header_h1_title = updateContentDto.header.h1_title;
			}

			if (updateContentDto.header.caption !== undefined) {
				content.header_caption = updateContentDto.header.caption;
			}
		}

		if (updateContentDto.skills !== undefined) {
			await this.contentSkillRepository.delete({
				content: {
					id: content.id,
				},
			});

			content.skills = updateContentDto.skills.map((skill) =>
				this.contentSkillRepository.create({
					title: skill.title,
					proficiency: skill.proficiency,
					content,
				}),
			);
		}

		await this.contentRepository.save(content);

		return this.findOne(id);
	}

	async remove(id: number) {
		const content = await this.findEntity(id);

		await this.contentRepository.remove(content);

		return { deleted: true };
	}

	async uploadImage(file: Express.Multer.File) {
		if (!file) {
			throw new BadRequestException('File is required');
		}

		const uploadDir = join(process.cwd(), 'uploads');

		if (!existsSync(uploadDir)) {
			mkdirSync(uploadDir, { recursive: true });
		}

		const filename = `${uuidv4()}.webp`;
		const filepath = join(uploadDir, filename);

		await sharp(file.buffer).webp().toFile(filepath);

		const media = this.mediaRepository.create({
			title: file.originalname ? parse(file.originalname).name : filename,
			type: MediaType.IMAGE,
			url: `/uploads/${filename}`,
			blog: null,
		});

		const savedMedia = await this.mediaRepository.save(media);

		return savedMedia.id;
	}

	async assignFooterLogo(contentId: number, mediaId: number) {
		const content = await this.findEntity(contentId);
		const media = await this.findImageMedia(mediaId);

		content.footer_logo = media;

		await this.contentRepository.save(content);

		return this.findOne(contentId);
	}

	async assignHeaderAvatarImage(contentId: number, mediaId: number) {
		const content = await this.findEntity(contentId);
		const media = await this.findImageMedia(mediaId);

		content.header_avatar_image = media;

		await this.contentRepository.save(content);

		return this.findOne(contentId);
	}

	async addHeaderSliderImage(contentId: number, mediaId: number) {
		const content = await this.findEntity(contentId);
		const media = await this.findImageMedia(mediaId);

		content.header_slider_images = content.header_slider_images ?? [];

		const exists = content.header_slider_images.some(
			(sliderImage) => sliderImage.id === media.id,
		);

		if (!exists) {
			content.header_slider_images.push(media);
		}

		await this.contentRepository.save(content);

		return this.findOne(contentId);
	}

	async removeHeaderSliderImage(contentId: number, mediaId: number) {
		const content = await this.findEntity(contentId);

		content.header_slider_images = (content.header_slider_images ?? []).filter(
			(sliderImage) => sliderImage.id !== mediaId,
		);

		await this.contentRepository.save(content);

		return this.findOne(contentId);
	}

	async removeMedia(mediaId: number) {
		const media = await this.mediaRepository.findOneBy({
			id: mediaId,
		});

		if (!media) {
			throw new NotFoundException('Media not found');
		}

		const filename = media.url.replace('/uploads/', '');
		const filepath = join(process.cwd(), 'uploads', filename);

		if (existsSync(filepath)) {
			unlinkSync(filepath);
		}

		await this.mediaRepository.remove(media);

		return { deleted: true };
	}

	private async findEntity(id: number) {
		const content = await this.contentRepository.findOne({
			where: { id },
			relations: {
				footer_logo: true,
				header_avatar_image: true,
				header_slider_images: true,
				skills: true,
			},
		});

		if (!content) {
			throw new NotFoundException('Content not found');
		}

		return content;
	}

	private async findImageMedia(id: number) {
		const media = await this.mediaRepository.findOneBy({
			id,
		});

		if (!media) {
			throw new NotFoundException('Media not found');
		}

		if (media.type !== MediaType.IMAGE) {
			throw new BadRequestException('Media must be image');
		}

		if (media.disable) {
			throw new BadRequestException('Media is disabled');
		}

		return media;
	}

	private toResponse(content: Content): ContentResponseDto {
		return {
			footer: {
				links: content.footer_links ?? [],
				caption: content.footer_caption ?? '',
				logo: content.footer_logo?.url ?? null,
				mobile: content.footer_mobile ?? '',
				email: content.footer_email ?? '',
				telegram: content.footer_telegram ?? '',
				whatsapp: content.footer_whatsapp ?? '',
			},
			header: {
				avatar_image: content.header_avatar_image?.url ?? null,
				slider_images:
					content.header_slider_images?.map((media) => media.url) ?? [],
				h1_title: content.header_h1_title ?? '',
				caption: content.header_caption ?? '',
			},
			skills:
				content.skills?.map((skill) => ({
					title: skill.title,
					proficiency: skill.proficiency,
				})) ?? [],
		};
	}
}
