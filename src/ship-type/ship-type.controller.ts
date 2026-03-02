import { Controller } from '@nestjs/common';
import { ShipTypeService } from './ship-type.service';

@Controller('ship-type')
export class ShipTypeController {
  constructor(private readonly shipTypeService: ShipTypeService) {}
}
