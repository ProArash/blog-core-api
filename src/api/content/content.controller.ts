import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	ParseIntPipe,
	Patch,
	Post,
	UploadedFile,
	UseGuards,
	UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import { UserRole } from '@/api/user/entities/user.entity';
import { ContentService } from './content.service';
import { CreateContentDto, UpdateContentDto } from './dto/create-content.dto';
import { Roles } from '@/api/auth/roles.decorator';
import { RolesGuard } from '@/api/auth/roles.guard';

@Controller('content')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(UserRole.ADMIN)
export class ContentController {
	constructor(private readonly contentService: ContentService) {}

	@Post()
	create(@Body() createContentDto: CreateContentDto) {
		return this.contentService.create(createContentDto);
	}

	@Post('upload-image')
	@UseInterceptors(FileInterceptor('file'))
	@ApiConsumes('multipart/form-data')
	@ApiBody({
		schema: {
			type: 'object',
			required: ['file'],
			properties: {
				file: {
					type: 'string',
					format: 'binary',
				},
			},
		},
	})
	uploadImage(@UploadedFile() file: Express.Multer.File) {
		return this.contentService.uploadImage(file);
	}

	@Patch(':id/footer/logo/:mediaId')
	assignFooterLogo(
		@Param('id', ParseIntPipe) id: number,
		@Param('mediaId', ParseIntPipe) mediaId: number,
	) {
		return this.contentService.assignFooterLogo(id, mediaId);
	}

	@Patch(':id/header/avatar-image/:mediaId')
	assignHeaderAvatarImage(
		@Param('id', ParseIntPipe) id: number,
		@Param('mediaId', ParseIntPipe) mediaId: number,
	) {
		return this.contentService.assignHeaderAvatarImage(id, mediaId);
	}

	@Patch(':id/header/slider-images/:mediaId')
	addHeaderSliderImage(
		@Param('id', ParseIntPipe) id: number,
		@Param('mediaId', ParseIntPipe) mediaId: number,
	) {
		return this.contentService.addHeaderSliderImage(id, mediaId);
	}

	@Delete(':id/header/slider-images/:mediaId')
	removeHeaderSliderImage(
		@Param('id', ParseIntPipe) id: number,
		@Param('mediaId', ParseIntPipe) mediaId: number,
	) {
		return this.contentService.removeHeaderSliderImage(id, mediaId);
	}

	@Delete('media/:mediaId')
	removeMedia(@Param('mediaId', ParseIntPipe) mediaId: number) {
		return this.contentService.removeMedia(mediaId);
	}

	@Get()
	findAll() {
		return this.contentService.findAll();
	}

	@Get(':id')
	findOne(@Param('id', ParseIntPipe) id: number) {
		return this.contentService.findOne(id);
	}

	@Patch(':id')
	update(
		@Param('id', ParseIntPipe) id: number,
		@Body() updateContentDto: UpdateContentDto,
	) {
		return this.contentService.update(id, updateContentDto);
	}

	@Delete(':id')
	remove(@Param('id', ParseIntPipe) id: number) {
		return this.contentService.remove(id);
	}
}
