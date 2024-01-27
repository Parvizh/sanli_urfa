import { IsNotEmpty, IsString } from "class-validator";

export class CreateSocialNetworkLinkDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  url: string;
}
