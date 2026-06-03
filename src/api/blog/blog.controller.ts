import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	ParseIntPipe,
	Patch,
	Post,
	Query,
	Req,
	UseGuards,
} from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import type { Request } from 'express';
import { BlogService } from './blog.service';
import { CreateBlogDto, UpdateBlogDto } from '@/api/blog/dto/create-blog.dto';
import { UserPayload } from '@/utils/user.payload';
import { Roles } from '@/api/auth/roles.decorator';
import { UserRole } from '@/api/user/entities/user.entity';

@Controller('blog')
@UseGuards(AuthGuard('jwt'))
@Roles(UserRole.ADMIN)
export class BlogController {
	constructor(private readonly blogService: BlogService) {}

	@Post()
	create(@Body() createBlogDto: CreateBlogDto, @Req() req: Request) {
		const { id: userId } = req.user as UserPayload;
		return this.blogService.create(createBlogDto, +userId);
	}

	@Get()
	@ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
	@ApiQuery({ name: 'pageSize', required: false, type: Number, example: 5 })
	findAll(@Query('page') page?: number, @Query('pageSize') pageSize?: number) {
		return this.blogService.findAll(page, pageSize);
	}

	@Get('slug/:slug')
	findBySlug(@Param('slug') slug: string) {
		return this.blogService.findBySlug(slug);
	}

	@Get(':id')
	findOne(@Param('id', ParseIntPipe) id: number) {
		return this.blogService.findOne(id);
	}

	@Patch(':id')
	update(
		@Param('id', ParseIntPipe) id: number,
		@Body() updateBlogDto: UpdateBlogDto,
	) {
		return this.blogService.update(id, updateBlogDto);
	}

	@Delete(':id')
	remove(@Param('id', ParseIntPipe) id: number) {
		return this.blogService.remove(id);
	}
}
