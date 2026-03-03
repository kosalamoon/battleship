import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus } from '@nestjs/common';
import { GameController } from './game.controller';
import { GameService } from './game.service';

describe('GameController', () => {
  let controller: GameController;
  let gameService: Record<string, jest.Mock>;

  beforeEach(async () => {
    gameService = {
      startGame: jest.fn(),
      shoot: jest.fn(),
      getGameState: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [GameController],
      providers: [{ provide: GameService, useValue: gameService }],
    }).compile();

    controller = module.get<GameController>(GameController);
  });

  describe('getGameState', () => {
    it('should return game state wrapped in ApiResponse', async () => {
      const stateDto = {
        gameId: 'g1',
        status: 'IN_PROGRESS',
        gridSize: 10,
        shots: [],
        shipsRemaining: 3,
      };
      gameService.getGameState.mockResolvedValue(stateDto);

      const result = await controller.getGameState('g1');

      expect(result.success).toBe(true);
      expect(result.data).toEqual(stateDto);
      expect(result.message).toBe('Game state retrieved successfully');
    });
  });

  describe('startGame', () => {
    it('should return new game wrapped in ApiResponse with CREATED status', async () => {
      const startDto = {
        gameId: 'g1',
        status: 'NOT_STARTED',
        gridSize: 10,
        ships: [],
      };
      gameService.startGame.mockResolvedValue(startDto);

      const result = await controller.startGame();

      expect(result.success).toBe(true);
      expect(result.data).toEqual(startDto);
      expect(result.statusCode).toBe(HttpStatus.CREATED);
    });
  });

  describe('shoot', () => {
    it('should return HIT message', async () => {
      const shootDto = {
        gameId: 'g1',
        position: 'A1',
        result: 'HIT' as const,
        gameOver: false,
        gameStatus: 'IN_PROGRESS',
      };
      gameService.shoot.mockResolvedValue(shootDto);

      const result = await controller.shoot({
        gameId: 'g1',
        position: 'A1',
      });

      expect(result.message).toBe('Hit!');
    });

    it('should return sunk message when ship is sunk', async () => {
      gameService.shoot.mockResolvedValue({
        gameId: 'g1',
        position: 'A1',
        result: 'HIT',
        shipSunk: 'Destroyer',
        gameOver: false,
        gameStatus: 'IN_PROGRESS',
      });

      const result = await controller.shoot({
        gameId: 'g1',
        position: 'A1',
      });

      expect(result.message).toBe('Hit! You sunk the Destroyer!');
    });

    it('should return game over message', async () => {
      gameService.shoot.mockResolvedValue({
        gameId: 'g1',
        position: 'A1',
        result: 'HIT',
        gameOver: true,
        gameStatus: 'COMPLETED',
      });

      const result = await controller.shoot({
        gameId: 'g1',
        position: 'A1',
      });

      expect(result.message).toBe('All ships sunk! Game over!');
    });

    it('should return miss message', async () => {
      gameService.shoot.mockResolvedValue({
        gameId: 'g1',
        position: 'A1',
        result: 'MISS',
        gameOver: false,
        gameStatus: 'IN_PROGRESS',
      });

      const result = await controller.shoot({
        gameId: 'g1',
        position: 'A1',
      });

      expect(result.message).toBe('Miss!');
    });

    it('should return already shot message', async () => {
      gameService.shoot.mockResolvedValue({
        gameId: 'g1',
        position: 'A1',
        result: 'ALREADY_SHOT',
        gameOver: false,
        gameStatus: 'IN_PROGRESS',
      });

      const result = await controller.shoot({
        gameId: 'g1',
        position: 'A1',
      });

      expect(result.message).toBe('Already shot at this position');
    });
  });
});
