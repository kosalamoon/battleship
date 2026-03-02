import { Controller, HttpStatus, Logger, Post } from '@nestjs/common';
import { ApiResponse } from 'src/common/dto/api-response.dto';
import { StartGameResponseDto } from './dto/start-game-response.dto';
import { GameService } from './game.service';

@Controller('games')
export class GameController {
  private readonly logger = new Logger(GameController.name);

  constructor(private readonly gameService: GameService) {}

  @Post('start')
  async startGame(): Promise<ApiResponse<StartGameResponseDto>> {
    this.logger.log('Received request to start a new game');
    const data = await this.gameService.startGame();
    return ApiResponse.success(
      data,
      'Game started successfully',
      HttpStatus.CREATED,
    );
  }

  @Post('end')
  async endGame() {}

  @Post('shoot')
  async shoot() {}
}
