import { Body, Controller, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { ContactInfoService } from "./contact-info.service";
import { CreateContactInfoDto } from "./dto/create-contact-info.dto";
import { UpdateContactInfoDto } from "./dto/update-contact-info.dto";
import { AuthGuard } from "@nestjs/passport";
import { IsAdminGuard } from "../auth/guards/is-admin.guard";

@Controller("contact-info")
export class ContactInfoController {
  constructor(private readonly contactInfoService: ContactInfoService) { }

  @UseGuards(AuthGuard('jwt'), IsAdminGuard)
  @Post('/')
  create(@Body() createContactInfoDto: CreateContactInfoDto) {
    return this.contactInfoService.create(createContactInfoDto);
  }

  @Get("/:lang")
  get(@Param("lang") lang: string) {
    return this.contactInfoService.get(lang);
  }

  @UseGuards(AuthGuard('jwt'), IsAdminGuard)
  @Patch("/:lang")
  update(@Param("lang") lang: string, @Body() updateContactInfoDto: UpdateContactInfoDto) {
    return this.contactInfoService.update(lang, updateContactInfoDto);
  }
}
