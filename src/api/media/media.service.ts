import { Blog } from '@/api/blog/entities/blog.entity';
import { UpdateMediaDto } from '@/api/media/dto/media.dto';
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

@Injectable()
export class MediaService {
	constructor(
		@InjectRepository(Media)
		private readonly mediaRepository: Repository<Media>,

		@InjectRepository(Blog)
		private readonly blogRepository: Repository<Blog>,
	) {}

	async upload(file: Express.Multer.File) {
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

	async assignToBlog(imageId: number, blogId: number) {
		const media = await this.mediaRepository.findOne({
			where: { id: imageId },
			relations: {
				blog: true,
			},
		});

		if (!media) {
			throw new NotFoundException('Media not found');
		}

		const blog = await this.blogRepository.findOneBy({
			id: blogId,
		});

		if (!blog) {
			throw new NotFoundException('Blog not found');
		}

		media.blog = blog;

		return this.mediaRepository.save(media);
	}

	findAll() {
		return this.mediaRepository.find({
			relations: {
				blog: true,
			},
		});
	}

	async findOne(id: number) {
		const media = await this.mediaRepository.findOne({
			where: { id },
			relations: {
				blog: true,
			},
		});

		if (!media) {
			throw new NotFoundException('Media not found');
		}

		return media;
	}

	async update(id: number, updateMediaDto: UpdateMediaDto) {
		const media = await this.findOne(id);

		this.mediaRepository.merge(media, {
			title: updateMediaDto.title,
			type: updateMediaDto.type,
			disable: updateMediaDto.disable,
		});

		return this.mediaRepository.save(media);
	}

	async remove(id: number) {
		const media = await this.findOne(id);

		const filename = media.url.replace('/uploads/', '');
		const filepath = join(process.cwd(), 'uploads', filename);

		if (existsSync(filepath)) {
			unlinkSync(filepath);
		}

		await this.mediaRepository.remove(media);

		return { deleted: true };
	}
}
