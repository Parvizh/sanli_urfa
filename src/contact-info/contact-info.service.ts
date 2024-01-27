import { ConflictException, HttpException, Injectable, NotImplementedException } from "@nestjs/common";
import { CreateContactInfoDto } from "./dto/create-contact-info.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { ContactInfo } from "./entities/contact-info.entity";
import { Repository } from "typeorm";
import { UpdateContactInfoDto } from "./dto/update-contact-info.dto";

@Injectable()
export class ContactInfoService {
  constructor(@InjectRepository(ContactInfo) private readonly contactInfoRepository: Repository<ContactInfo>) {
  }

  async create(createContactInfoDto: CreateContactInfoDto) {

    const dupeEntry = await this.get(createContactInfoDto.lang);

    if (dupeEntry) throw new ConflictException(`Contact info with lang ${dupeEntry.lang} already exists`);

    const contactInfo = this.contactInfoRepository.create(createContactInfoDto);
    const data = await this.contactInfoRepository.save(contactInfo);

    if (data) return data;
    else throw new NotImplementedException('Could not create contact info');
  }

  async get(lang: string) {
    return this.contactInfoRepository.findOne({ where: { lang } });
  }

  async update(lang: string, updateContactInfoDto: UpdateContactInfoDto) {
    const contactData = await this.get(lang);
    Object.assign(contactData.contacts, updateContactInfoDto);
    const data = await this.contactInfoRepository.save(contactData);

    if (data) return { message: 'Successfully updated contact info' };
    else throw new NotImplementedException('Could not update contact info');
  }
}