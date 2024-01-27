import { PartialType } from '@nestjs/mapped-types';
import { CreateSocialNetworkLinkDto } from './create-social-network-link.dto';

export class UpdateSocialNetworkLinkDto extends PartialType(CreateSocialNetworkLinkDto) {}
