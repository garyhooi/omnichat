import {
  Controller,
  Get,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { HttpLogService } from './http-log.service';

@Controller('logs/http')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles('admin')
export class HttpLogController {
  constructor(private readonly httpLogService: HttpLogService) {}

  @Get()
  async findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('method') method?: string,
    @Query('statusCode') statusCode?: string,
    @Query('search') search?: string,
  ) {
    return this.httpLogService.findAll({
      page: page ? parseInt(page, 10) : undefined,
      limit: limit ? parseInt(limit, 10) : undefined,
      startDate,
      endDate,
      method,
      statusCode: statusCode ? parseInt(statusCode, 10) : undefined,
      search,
    });
  }
}
