import { Controller } from '@nestjs/common';
import { ShotService } from './shot.service';

@Controller('shot')
export class ShotController {
  constructor(private readonly shotService: ShotService) {}
}
