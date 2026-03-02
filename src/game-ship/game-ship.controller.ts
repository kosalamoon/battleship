import { Controller } from '@nestjs/common';
import { GameShipService } from './game-ship.service';

@Controller('game-ship')
export class GameShipController {
  constructor(private readonly gameShipService: GameShipService) {}
}
