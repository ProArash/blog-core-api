import {
	Controller,
	Get,
	Post,
	Body,
	Delete,
	ValidationPipe,
	UseGuards,
	Query,
} from '@nestjs/common';
import { InquiryService } from './inquiry.service';
import { CreateInquiryDto } from './dto/create-inquiry.dto';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../auth/roles.decorator';
import { UserRoles } from '../user/entities/user.entity';
import { RolesGuard } from '../auth/roles.guard';

@Controller('inquiry')
export class InquiryController {
	constructor(private readonly inquiryService: InquiryService) {}

	@Post('newInquiry')
	newProject(@Body(new ValidationPipe()) createIqueryDto: CreateInquiryDto) {
		return this.inquiryService.newInquiry(createIqueryDto);
	}

	@UseGuards(AuthGuard('jwt'), RolesGuard)
	@Roles(UserRoles.ADMIN)
	@Get('getAllInquiries')
	getAllInquiries(@Query('pageNumber') pageNumber: string) {
		return this.inquiryService.getAllInquiries(+pageNumber);
	}

	@UseGuards(AuthGuard('jwt'), RolesGuard)
	@Roles(UserRoles.ADMIN)
	@Get('getInquiryById')
	getInquiryById(@Query('projectId') projectId: string) {
		return this.inquiryService.getInquiryById(+projectId);
	}

	@UseGuards(AuthGuard('jwt'), RolesGuard)
	@Roles(UserRoles.ADMIN)
	@Delete('deleteInquiryById')
	deleteInquiryById(@Query('inquiryId') inquiryId: string) {
		return this.inquiryService.deleteInquiryById(+inquiryId);
	}
}
