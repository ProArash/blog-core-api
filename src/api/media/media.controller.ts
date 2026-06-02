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
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import { UpdateMediaDto } from '@/api/media/dto/media.dto';
import { MediaService } from '@/api/media/media.service';
import { Roles } from '@/api/auth/roles.decorator';
import { UserRole } from '@/api/user/entities/user.entity';
import { AuthGuard } from '@nestjs/passport';

@Controller('media')
@UseGuards(AuthGuard('jwt'))
@Roles(UserRole.ADMIN)
export class MediaController {
	constructor(private readonly mediaService: MediaService) {}

	@Post('upload')
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
	upload(@UploadedFile() file: Express.Multer.File) {
		return this.mediaService.upload(file);
	}

	@Get()
	findAll() {
		return this.mediaService.findAll();
	}

	@Get(':id')
	findOne(@Param('id', ParseIntPipe) id: number) {
		return this.mediaService.findOne(id);
	}

	@Patch(':id')
	update(
		@Param('id', ParseIntPipe) id: number,
		@Body() updateMediaDto: UpdateMediaDto,
	) {
		return this.mediaService.update(id, updateMediaDto);
	}

	@Delete(':id')
	remove(@Param('id', ParseIntPipe) id: number) {
		return this.mediaService.remove(id);
	}
}
