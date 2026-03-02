import { Controller, Post } from '@nestjs/common';
import { GameService } from './game.service';

@Controller('games')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Post('start')
  async startGame() {}

  @Post('end')
  async endGame() {}

  @Post('shoot')
  async shoot() {}
}
