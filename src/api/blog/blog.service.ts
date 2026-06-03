import { CreateBlogDto, UpdateBlogDto } from '@/api/blog/dto/create-blog.dto';
import { Blog, BlogStatus } from '@/api/blog/entities/blog.entity';
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

	private async getBlogEntityById(id: number) {
		const blog = await this.blogRepository.findOneBy({ id });

		if (!blog) {
			throw new NotFoundException('Blog not found');
		}

		return blog;
	}

	private async resolveFeaturedImage(
		featuredImageId?: number,
	): Promise<Media | null> {
		if (featuredImageId === undefined) {
			return undefined as unknown as null;
		}

		if (featuredImageId === null) {
			return null;
		}

		const media = await this.mediaRepository.findOneBy({
			id: featuredImageId,
		});

		if (!media) {
			throw new NotFoundException(
				`Featured image not found: ${featuredImageId}`,
			);
		}

		return media;
	}

	private mapBlogDetails(blog: Blog) {
		return {
			id: blog.id,
			slug: blog.slug,
			title: blog.title,
			description: blog.description,
			canonical_url: blog.canonical_url,
			noindex: blog.noindex,
			nofollow: blog.nofollow,
			like_count: blog.like_count,
			view_count: blog.view_count,
			status: blog.status,
			published_at: blog.published_at,
			featured_image: blog.featured_image
				? {
						title: blog.featured_image.title,
						type: blog.featured_image.type,
						url: blog.featured_image.url,
						disable: blog.featured_image.disable,
					}
				: null,
			media: (blog.media ?? []).map((media) => ({
				title: media.title,
				type: media.type,
				url: media.url,
				disable: media.disable,
			})),
		};
	}

	private mapBlogListItem(blog: Blog) {
		return {
			id: blog.id,
			slug: blog.slug,
			title: blog.title,
			status: blog.status,
			published_at: blog.published_at,
			updatedAt: blog.updatedAt,
			featured_image: blog.featured_image
				? {
						title: blog.featured_image.title,
						url: blog.featured_image.url,
						disable: blog.featured_image.disable,
					}
				: null,
		};
	}

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

	private resolvePublishedAt(
		status?: BlogStatus,
		publishedAt?: string,
		currentPublishedAt?: Date | null,
	): Date | null {
		if (publishedAt) {
			return new Date(publishedAt);
		}

		if (status === BlogStatus.PUBLISHED && !currentPublishedAt) {
			return new Date();
		}

		if (status && status !== BlogStatus.PUBLISHED) {
			return null;
		}

		return currentPublishedAt ?? null;
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

		const featuredImage = await this.resolveFeaturedImage(
			createBlogDto.featured_image_id,
		);

		const blog = this.blogRepository.create({
			title: createBlogDto.title,
			slug: createBlogDto.slug,
			description: createBlogDto.description,
			canonical_url: createBlogDto.canonical_url,
			noindex: createBlogDto.noindex,
			nofollow: createBlogDto.nofollow,
			status: createBlogDto.status,
			published_at: this.resolvePublishedAt(
				createBlogDto.status,
				createBlogDto.published_at,
			),
			featured_image: featuredImage,
			user,
		});

		const savedBlog = await this.blogRepository.save(blog);

		await this.syncBlogMedia(savedBlog, createBlogDto.mediaIds);

		return this.findOne(savedBlog.id);
	}

	async findAll(page = 1, pageSize = 5) {
		const currentPage = Number(page) > 0 ? Math.floor(Number(page)) : 1;
		const currentPageSize =
			Number(pageSize) > 0 ? Math.floor(Number(pageSize)) : 5;

		const [blogs, total] = await this.blogRepository.findAndCount({
			select: {
				id: true,
				slug: true,
				title: true,
				status: true,
				published_at: true,
				updatedAt: true,
				featured_image: {
					title: true,
					url: true,
					disable: true,
				},
			},
			relations: {
				featured_image: true,
			},
			order: {
				updatedAt: 'DESC',
			},
			skip: (currentPage - 1) * currentPageSize,
			take: currentPageSize,
		});

		return {
			data: blogs.map((blog) => this.mapBlogListItem(blog)),
			pagination: {
				page: currentPage,
				pageSize: currentPageSize,
				totalItems: total,
				totalPages: Math.ceil(total / currentPageSize),
			},
		};
	}

	async findOne(id: number) {
		const blog = await this.blogRepository.findOne({
			where: { id },
			select: {
				id: true,
				slug: true,
				title: true,
				description: true,
				canonical_url: true,
				noindex: true,
				nofollow: true,
				like_count: true,
				view_count: true,
				status: true,
				published_at: true,
				featured_image: {
					title: true,
					type: true,
					url: true,
					disable: true,
				},
				media: {
					title: true,
					type: true,
					url: true,
					disable: true,
				},
			},
			relations: {
				featured_image: true,
				media: true,
			},
		});

		if (!blog) {
			throw new NotFoundException('Blog not found');
		}

		return this.mapBlogDetails(blog);
	}

	async findBySlug(slug: string) {
		const blog = await this.blogRepository.findOne({
			where: { slug },
			select: {
				id: true,
				slug: true,
				title: true,
				description: true,
				canonical_url: true,
				noindex: true,
				nofollow: true,
				like_count: true,
				view_count: true,
				status: true,
				published_at: true,
				featured_image: {
					title: true,
					type: true,
					url: true,
					disable: true,
				},
				media: {
					title: true,
					type: true,
					url: true,
					disable: true,
				},
			},
			relations: {
				featured_image: true,
				media: true,
			},
		});

		if (!blog) {
			throw new NotFoundException('Blog not found');
		}

		return this.mapBlogDetails(blog);
	}

	async update(id: number, updateBlogDto: UpdateBlogDto) {
		const blog = await this.blogRepository.findOne({
			where: { id },
			relations: { featured_image: true },
		});

		if (!blog) {
			throw new NotFoundException('Blog not found');
		}

		if (updateBlogDto.slug && updateBlogDto.slug !== blog.slug) {
			const existsBlog = await this.blogRepository.findOneBy({
				slug: updateBlogDto.slug,
			});

			if (existsBlog) {
				throw new ConflictException('Blog slug already exists');
			}
		}

		const featuredImage = await this.resolveFeaturedImage(
			updateBlogDto.featured_image_id,
		);

		this.blogRepository.merge(blog, {
			title: updateBlogDto.title,
			slug: updateBlogDto.slug,
			description: updateBlogDto.description,
			canonical_url: updateBlogDto.canonical_url,
			noindex: updateBlogDto.noindex,
			nofollow: updateBlogDto.nofollow,
			status: updateBlogDto.status,
			published_at: this.resolvePublishedAt(
				updateBlogDto.status,
				updateBlogDto.published_at,
				blog.published_at,
			),
			...(featuredImage !== (undefined as unknown as null)
				? { featured_image: featuredImage }
				: {}),
		});

		const updatedBlog = await this.blogRepository.save(blog);

		await this.syncBlogMedia(updatedBlog, updateBlogDto.mediaIds);

		return this.findOne(updatedBlog.id);
	}

	async remove(id: number) {
		const blog = await this.getBlogEntityById(id);

		await this.blogRepository.remove(blog);

		return { deleted: true };
	}
}
