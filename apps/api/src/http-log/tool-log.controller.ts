import {
  Controller,
  Get,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { AdminIpAllowlistGuard } from '../auth/admin-ip-allowlist.guard';
import { ToolLogService } from './tool-log.service';

@Controller('logs/tool')
@UseGuards(AdminIpAllowlistGuard, AuthGuard('jwt'), RolesGuard)
@Roles('admin', 'developer')
export class ToolLogController {
  constructor(private readonly toolLogService: ToolLogService) {}

  @Get()
  async findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('toolName') toolName?: string,
    @Query('handlerType') handlerType?: string,
    @Query('success') success?: string,
    @Query('search') search?: string,
  ) {
    return this.toolLogService.findAll({
      page: page ? parseInt(page, 10) : undefined,
      limit: limit ? parseInt(limit, 10) : undefined,
      startDate,
      endDate,
      toolName,
      handlerType,
      success,
      search,
    });
  }
}
