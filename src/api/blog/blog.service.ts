// src/api/blog/blog.service.ts

import { CreateBlogDto, UpdateBlogDto } from '@/api/blog/dto/create-blog.dto';
import { Blog } from '@/api/blog/entities/blog.entity';
import { Media } from '@/api/media/entities/media.entity';
import { User } from '@/api/user/entities/user.entity';
import {
	ConflictException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

@Injectable()
export class BlogService {
	constructor(
		@InjectRepository(Blog)
		private readonly blogRepository: Repository<Blog>,

		@InjectRepository(User)
		private readonly userRepository: Repository<User>,

		@InjectRepository(Media)
		private readonly mediaRepository: Repository<Media>,
	) {}

	private async syncBlogMedia(blog: Blog, mediaIds?: number[]) {
		if (mediaIds === undefined) {
			return;
		}

		const uniqueMediaIds = [...new Set(mediaIds)];
		let mediaList: Media[] = [];

		if (uniqueMediaIds.length) {
			mediaList = await this.mediaRepository.find({
				where: {
					id: In(uniqueMediaIds),
				},
			});

			if (mediaList.length !== uniqueMediaIds.length) {
				const foundIds = mediaList.map((media) => media.id);
				const missingIds = uniqueMediaIds.filter(
					(id) => !foundIds.includes(id),
				);

				throw new NotFoundException(
					`Media not found: ${missingIds.join(', ')}`,
				);
			}
		}

		const currentBlogMedia = await this.mediaRepository.find({
			where: {
				blog: {
					id: blog.id,
				},
			},
		});

		const mediaToUnassign = currentBlogMedia.filter(
			(media) => !uniqueMediaIds.includes(media.id),
		);

		if (mediaToUnassign.length) {
			mediaToUnassign.forEach((media) => {
				media.blog = null;
			});

			await this.mediaRepository.save(mediaToUnassign);
		}

		if (mediaList.length) {
			mediaList.forEach((media) => {
				media.blog = blog;
			});

			await this.mediaRepository.save(mediaList);
		}
	}

	async create(createBlogDto: CreateBlogDto, userId: number) {
		const user = await this.userRepository.findOneBy({
			id: userId,
		});

		if (!user) {
			throw new NotFoundException('User not found');
		}

		const existsBlog = await this.blogRepository.findOneBy({
			slug: createBlogDto.slug,
		});

		if (existsBlog) {
			throw new ConflictException('Blog slug already exists');
		}

		const blog = this.blogRepository.create({
			title: createBlogDto.title,
			slug: createBlogDto.slug,
			description: createBlogDto.description,
			seo_keywords: createBlogDto.seo_keywords,
			seo_short_description: createBlogDto.seo_short_description,
			user,
		});

		const savedBlog = await this.blogRepository.save(blog);

		await this.syncBlogMedia(savedBlog, createBlogDto.mediaIds);

		return this.findOne(savedBlog.id);
	}

	findAll() {
		return this.blogRepository.find({
			relations: {
				user: true,
				media: true,
				comments: true,
			},
			order: {
				id: 'DESC',
			},
		});
	}

	async findOne(id: number) {
		const blog = await this.blogRepository.findOne({
			where: { id },
			relations: {
				user: true,
				media: true,
				comments: true,
			},
		});

		if (!blog) {
			throw new NotFoundException('Blog not found');
		}

		return blog;
	}

	async findBySlug(slug: string) {
		const blog = await this.blogRepository.findOne({
			where: { slug },
			relations: {
				user: true,
				media: true,
				comments: true,
			},
		});

		if (!blog) {
			throw new NotFoundException('Blog not found');
		}

		return blog;
	}

	async update(id: number, updateBlogDto: UpdateBlogDto) {
		const blog = await this.findOne(id);

		if (updateBlogDto.slug && updateBlogDto.slug !== blog.slug) {
			const existsBlog = await this.blogRepository.findOneBy({
				slug: updateBlogDto.slug,
			});

			if (existsBlog) {
				throw new ConflictException('Blog slug already exists');
			}
		}

		this.blogRepository.merge(blog, {
			title: updateBlogDto.title,
			slug: updateBlogDto.slug,
			description: updateBlogDto.description,
			seo_keywords: updateBlogDto.seo_keywords,
			seo_short_description: updateBlogDto.seo_short_description,
		});

		const updatedBlog = await this.blogRepository.save(blog);

		await this.syncBlogMedia(updatedBlog, updateBlogDto.mediaIds);

		return this.findOne(updatedBlog.id);
	}

	async remove(id: number) {
		const blog = await this.findOne(id);

		await this.blogRepository.remove(blog);

		return { deleted: true };
	}
}
