import { Controller, Get, Post, Body, Param, Delete, UseGuards, ParseIntPipe } from "@nestjs/common";
import { SocialNetworkLinksService } from "./social-network-links.service";
import { CreateSocialNetworkLinkDto } from "./dto/create-social-network-link.dto";
import { AuthGuard } from "@nestjs/passport";
import { IsAdminGuard } from "../auth/guards/is-admin.guard";

@Controller("social-network-links")
export class SocialNetworkLinksController {
  constructor(private readonly socialNetworkLinksService: SocialNetworkLinksService) { }

  @UseGuards(AuthGuard('jwt'), IsAdminGuard)
  @Post()
  create(@Body() createSocialNetworkLinkDto: CreateSocialNetworkLinkDto) {
    return this.socialNetworkLinksService.create(createSocialNetworkLinkDto);
  }

  @Get()
  get() {
    return this.socialNetworkLinksService.get();
  }

  @UseGuards(AuthGuard('jwt'), IsAdminGuard)
  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.socialNetworkLinksService.delete(id);
  }
}
