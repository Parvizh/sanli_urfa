import { UnprocessableEntityException, Injectable, NotImplementedException } from "@nestjs/common";
import { CreateMailDto } from "./dto/create-mail.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Mail } from "./entities/mail.entity";
import { Repository } from "typeorm";
import { MailerService } from "@nestjs-modules/mailer";
import { ConfigService } from "@nestjs/config";
import { CreateCareerMailDto } from './dto/create-career-mail.dto';
import { deleteImage } from 'src/helpers/file-helper';
import { CreateConfirmationMailDto } from './dto/create-confirmation-mail.dto';

@Injectable()
export class MailService {
  constructor(@InjectRepository(Mail) private readonly mailRepository: Repository<Mail>,
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService) {
  }

  async create(createMailDto: CreateMailDto) {
    let mail = this.mailRepository.create(createMailDto);
    await this.mailRepository.save(mail);
    const data = await this.sendContactMail(createMailDto);

    if (data) return data;
    else throw new NotImplementedException('Could not sent email');
  }

  async sendContactMail(createMailDto: CreateMailDto) {
    let text = `You have a new message from ${createMailDto.fullName}:
                Contact number: ${createMailDto.mobile}
                Email: ${createMailDto.email}
                Message: ${createMailDto.message}`;

    return await this.mailerService.sendMail({
      to: 'taleh958@gmail.com',
      from: this.configService.get('MAIL_FROM'),
      subject: 'Customer mail',
      text
    });
  }

  async sendCareerMail(createCareerMailDto: CreateCareerMailDto, file: Express.Multer.File) {
    if (!file) throw new UnprocessableEntityException('Could not upload cv, please provide .pdf file');
    const text = `There is a career request from ${createCareerMailDto.fullName}:
                  Contact number: ${createCareerMailDto.phoneNumber}
                  Email: ${createCareerMailDto.email}
                  Vacancy: ${createCareerMailDto.vacancy}
                  CV is attached to this mail.`;

    const response = await this.mailerService.sendMail({
      to: 'taleh958@gmail.com',
      from: this.configService.get('MAIL_FROM'),
      subject: 'Career request',
      text,
      attachments: [{
        path: file.path,
        filename: file.filename,
        contentDisposition: 'attachment'
      }]
    })

    deleteImage(`cv/${file.filename}`);

    return response;
  }

  async sendEmailConfirmationMail(createConfirmtaionMailDto: CreateConfirmationMailDto) {
    const url = process.env.EMAIL_CONFIRMATION_URL + '/' + createConfirmtaionMailDto.token;
    const text = `Hello ${createConfirmtaionMailDto.firstName} ! <br/> \
                  We got a registration request from you. If you did not \
                  pass any registration stage on our page, please simply ignore this message. <br/> \
                  Follow this link to confirm your email: <br/>
                  <a href="${url}"> Click me! </a>`

    return await this.mailerService.sendMail({
      to: createConfirmtaionMailDto.email,
      from: this.configService.get('MAIL_FROM'),
      subject: 'Email confirmation',
      text
    });
  }

  async sendPasswordConfirmationMail(createConfirmtaionMailDto: CreateConfirmationMailDto) {
    const url = process.env.CONFIRM_PASSWORD_URL + '/' + createConfirmtaionMailDto.token;
    const text = `Hello ${createConfirmtaionMailDto.firstName} ! <br/> \
                  We got a forgot password request from you. If you did not \
                  pass any authentication stage on our page, please simply ignore this message. <br/> \
                  Follow this link to confirm your reset password procedure: <br/>
                  <a href="${url}"> Click me! </a>`

    return await this.mailerService.sendMail({
      to: createConfirmtaionMailDto.email,
      from: this.configService.get('MAIL_FROM'),
      subject: 'Reset password',
      text
    });
  }
}
