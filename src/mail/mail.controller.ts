import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile } from "@nestjs/common";
import { MailService } from "./mail.service";
import { CreateMailDto } from "./dto/create-mail.dto";
import { CreateCareerMailDto } from './dto/create-career-mail.dto';
import { FileInterceptor } from "@nestjs/platform-express";

@Controller("mail")
export class MailController {
  constructor(private readonly mailService: MailService) {
  }

  @Post("contact")
  create(@Body() createMailDto: CreateMailDto) {
    return this.mailService.create(createMailDto);
  }

  @Post("career")
  @UseInterceptors(FileInterceptor('cv'))
  createCareerRequest(@UploadedFile() cv: Express.Multer.File, @Body() createCareerMailDto: CreateCareerMailDto) {
    return this.mailService.sendCareerMail(createCareerMailDto, cv);
  }
}
