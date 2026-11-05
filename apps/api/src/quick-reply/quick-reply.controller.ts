import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { QuickReplyService } from './quick-reply.service';
import { AuthGuard } from '@nestjs/passport';
import { AdminIpAllowlistGuard } from '../auth/admin-ip-allowlist.guard';
import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

class QuickReplyDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  title: string;

  @IsString()
  @MaxLength(1000)
  content: string;
}

@UseGuards(AdminIpAllowlistGuard, AuthGuard('jwt'))
@Controller('quick-replies')
export class QuickReplyController {
  constructor(private readonly quickReplyService: QuickReplyService) {}

  @Get()
  async findAll() {
    return this.quickReplyService.findAll();
  }

  @Post()
  async create(@Body() body: QuickReplyDto) {
    return this.quickReplyService.create(body.title, body.content);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() body: QuickReplyDto) {
    return this.quickReplyService.update(id, body.title, body.content);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.quickReplyService.remove(id);
  }
}
