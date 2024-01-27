import { Injectable, NotImplementedException } from "@nestjs/common";
import { CreateSocialNetworkLinkDto } from "./dto/create-social-network-link.dto";
import { UpdateSocialNetworkLinkDto } from "./dto/update-social-network-link.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { SocialNetworkLink } from "./entities/social-network-link.entity";
import { Repository } from "typeorm";

@Injectable()
export class SocialNetworkLinksService {
  constructor(@InjectRepository(SocialNetworkLink) private readonly socialLinkRepository: Repository<SocialNetworkLink>) {
  }

  async create(createSocialNetworkLinkDto: CreateSocialNetworkLinkDto) {
    const link = this.socialLinkRepository.create(createSocialNetworkLinkDto);
    const data = await this.socialLinkRepository.save(link);

    if (data) return data;
    else throw new NotImplementedException('Could not create social network link');
  }

  async get() {
    return this.socialLinkRepository.find();
  }

  async delete(id: number) {
    const link = await this.socialLinkRepository.findOne({ where: { id: id } });
    const data = await this.socialLinkRepository.remove(link);

    if (data) return { message: 'Successfully deleted social network link' };
    else throw new NotImplementedException('Could not delete social network link');
  }
}
