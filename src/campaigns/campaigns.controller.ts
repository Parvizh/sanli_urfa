import { Controller, Get, Post, Patch, Param, Delete, UseInterceptors, UploadedFile, UseGuards, ParseIntPipe, Query } from "@nestjs/common";
import { CampaignsService } from "./campaigns.service";
import { FileInterceptor } from "@nestjs/platform-express";
import { AuthGuard } from '@nestjs/passport';
import { IsAdminGuard } from "../auth/guards/is-admin.guard";

export type FindCampaignsQuery = { limit?: number }

@Controller("campaigns")
export class CampaignsController {
  constructor(private readonly campaignsService: CampaignsService) { }

  @Get()
  get(@Query() query: FindCampaignsQuery) {
    return this.campaignsService.get(query);
  }

  @Get(':id')
  getById(@Param('id', ParseIntPipe) id: number) {
    return this.campaignsService.getById(id);
  }

  @UseGuards(AuthGuard('jwt'), IsAdminGuard)
  @Post()
  @UseInterceptors(FileInterceptor('campaignsFile'))
  add(@UploadedFile() file: Express.Multer.File) {
    return this.campaignsService.add(file?.filename);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'), IsAdminGuard)
  @UseInterceptors(FileInterceptor('campaignsFile'))
  update(@UploadedFile() file: Express.Multer.File, @Param('id', ParseIntPipe) id: number) {
    return this.campaignsService.update(id, file?.filename);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), IsAdminGuard)
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.campaignsService.delete(id);
  }
}