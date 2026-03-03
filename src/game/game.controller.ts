import { Body, Controller, HttpStatus, Logger, Post } from '@nestjs/common';
import { ApiResponse } from 'src/common/dto/api-response.dto';
import { ShootRequestDto } from './dto/shoot-request.dto';
import { ShootResponseDto } from './dto/shoot-response.dto';
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

  @Post('shoot')
  async shoot(
    @Body() dto: ShootRequestDto,
  ): Promise<ApiResponse<ShootResponseDto>> {
    this.logger.log(
      `Received shoot request: game=${dto.gameId}, position=${dto.position}`,
    );
    const data = await this.gameService.shoot(dto);
    const message = this.buildShootResponseMessage(data);
    return ApiResponse.success(data, message);
  }

  private buildShootResponseMessage(data: ShootResponseDto): string {
    if (data.gameOver) {
      return 'All ships sunk! Game over!';
    }
    if (data.result === 'HIT') {
      return data.shipSunk ? `Hit! You sunk the ${data.shipSunk}!` : 'Hit!';
    }
    if (data.result === 'MISS') {
      return 'Miss!';
    }
    return 'Already shot at this position';
  }
}
