import { PartialType } from '@nestjs/swagger';
import { CreateSliderImageDto } from './create-slider-image.dto';

export class UpdateSliderImageDto extends PartialType(CreateSliderImageDto) {}
