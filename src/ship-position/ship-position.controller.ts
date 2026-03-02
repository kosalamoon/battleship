import { Controller } from '@nestjs/common';
import { ShipPositionService } from './ship-position.service';

@Controller('ship-position')
export class ShipPositionController {
  constructor(private readonly shipPositionService: ShipPositionService) {}
}
