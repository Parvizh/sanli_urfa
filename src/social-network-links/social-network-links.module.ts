import { Module } from "@nestjs/common";
import { SocialNetworkLinksService } from "./social-network-links.service";
import { SocialNetworkLinksController } from "./social-network-links.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SocialNetworkLink } from "./entities/social-network-link.entity";

@Module({
  imports: [TypeOrmModule.forFeature([SocialNetworkLink])],
  controllers: [SocialNetworkLinksController],
  providers: [SocialNetworkLinksService]
})
export class SocialNetworkLinksModule {
}
