import {
	BadRequestException,
	Body,
	Controller,
	Delete,
	Get,
	Post,
	Query,
	UploadedFile,
	UseGuards,
	UseInterceptors,
	ValidationPipe,
} from '@nestjs/common';
import { PortfolioService } from './portfolio.service';
import { CreatePortfolioDto } from './dto/create-portfolio.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRoles } from '../user/entities/user.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuid } from 'uuid';
import { extname } from 'path';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';

@Controller('portfolio')
export class PortfolioController {
	constructor(private readonly portfolioService: PortfolioService) {}

	@UseGuards(AuthGuard('jwt'), RolesGuard)
	@Roles(UserRoles.ADMIN)
	@ApiConsumes('multipart/form-data')
	@ApiBody({
		description: 'Create a new portfolio item with media files',
		schema: {
			type: 'object',
			properties: {
				title: {
					type: 'string',
					example: 'My Awesome Project',
					description: 'Title of the portfolio item',
				},
				url: {
					type: 'string',
					example: 'https://myproject.com',
					description: 'URL associated with the portfolio item',
				},
				image: {
					type: 'array',
					items: {
						type: 'string',
						format: 'binary',
					},
					description: 'Array of image/files to upload',
				},
			},
			required: ['title', 'image', 'url'],
		},
	})
	@UseInterceptors(
		FileInterceptor('image', {
			storage: diskStorage({
				destination: './uploads',
				filename: (req, file, cb) => {
					const fileName = `${uuid()}${extname(file.originalname)}`;
					cb(null, fileName);
				},
			}),
		}),
	)
	@Post()
	async createPortfolio(
		@Body(new ValidationPipe()) data: CreatePortfolioDto,
		@UploadedFile() file: Express.Multer.File,
	) {
		if (!file) throw new BadRequestException('file is required.');
		return await this.portfolioService.create(
			data,
			`/uploads/${file.filename}`,
		);
	}

	@Get()
	async getAll(@Query('page') page: string) {
		return await this.portfolioService.getAll(+page);
	}

	@UseGuards(AuthGuard('jwt'), RolesGuard)
	@Roles(UserRoles.ADMIN)
	@Delete()
	async deleteById(@Query('id') id: string) {
		return await this.portfolioService.deleteById(+id);
	}
}
