import { Controller } from '@nestjs/common';
import { ShipInstanceService } from './ship-instance.service';

@Controller('ship-instance')
export class ShipInstanceController {
  constructor(private readonly shipInstanceService: ShipInstanceService) {}
}
