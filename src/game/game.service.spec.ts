import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { GameService } from './game.service';
import { GameEntity } from './game.entity';
import { ShipInstanceService } from '../ship-instance/ship-instance.service';
import { ShipPositionService } from '../ship-position/ship-position.service';
import { ShotService } from '../shot/shot.service';
import {
  createMockRepository,
  createMockDataSource,
  createMockGame,
  createMockShipInstance,
  createMockShipType,
  createMockShipPosition,
  createMockShot,
} from '../test/mocks';
import { DataSource } from 'typeorm';

describe('GameService', () => {
  let service: GameService;
  let gameRepository: ReturnType<typeof createMockRepository>;
  let shipInstanceService: Record<string, jest.Mock>;
  let shipPositionService: Record<string, jest.Mock | number>;
  let shotService: Record<string, jest.Mock>;
  let dataSource: ReturnType<typeof createMockDataSource>;
  let queryRunner: any;

  beforeEach(async () => {
    gameRepository = createMockRepository();
    shipInstanceService = {
      createBasedOnGameConfigs: jest.fn(),
      applyHit: jest.fn(),
      countUnsunkByGame: jest.fn(),
    };
    shipPositionService = {
      initializeShipPositions: jest.fn(),
      findByPositionAndGame: jest.fn(),
      markAsHit: jest.fn(),
      gridSize: 10,
    };
    shotService = {
      findByGameAndPosition: jest.fn(),
      create: jest.fn(),
      findAllByGame: jest.fn(),
    };
    dataSource = createMockDataSource();
    queryRunner = dataSource._queryRunner;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GameService,
        { provide: getRepositoryToken(GameEntity), useValue: gameRepository },
        { provide: ShipInstanceService, useValue: shipInstanceService },
        { provide: ShipPositionService, useValue: shipPositionService },
        { provide: ShotService, useValue: shotService },
        { provide: DataSource, useValue: dataSource },
      ],
    }).compile();

    service = module.get<GameService>(GameService);
  });

  describe('startGame', () => {
    it('should create a game, ships, and positions then commit', async () => {
      const game = createMockGame();
      const shipType = createMockShipType({ name: 'Destroyer', size: 2 });
      const instances = [
        createMockShipInstance({ id: 'si-1', shipType }),
        createMockShipInstance({ id: 'si-2', shipType }),
      ];

      queryRunner.manager.save.mockResolvedValueOnce(game);
      shipInstanceService.createBasedOnGameConfigs.mockResolvedValue(instances);
      (
        shipPositionService.initializeShipPositions as jest.Mock
      ).mockReturnValue([
        { shipInstanceId: 'si-1', position: 'A1' },
        { shipInstanceId: 'si-1', position: 'A2' },
        { shipInstanceId: 'si-2', position: 'B1' },
        { shipInstanceId: 'si-2', position: 'B2' },
      ]);
      queryRunner.manager.save.mockResolvedValueOnce(undefined);

      const result = await service.startGame();

      expect(result.gameId).toBe(game.id);
      expect(result.status).toBe('NOT_STARTED');
      expect(result.gridSize).toBe(10);
      expect(result.ships).toHaveLength(1);
      expect(result.ships[0].count).toBe(2);
      expect(queryRunner.commitTransaction).toHaveBeenCalled();
      expect(queryRunner.release).toHaveBeenCalled();
    });

    it('should group different ship types in response', async () => {
      const game = createMockGame();
      const destroyer = createMockShipType({ name: 'Destroyer', size: 2 });
      const cruiser = createMockShipType({ name: 'Cruiser', size: 3 });
      const instances = [
        createMockShipInstance({ id: 'si-1', shipType: destroyer }),
        createMockShipInstance({ id: 'si-2', shipType: cruiser }),
      ];

      queryRunner.manager.save.mockResolvedValueOnce(game);
      shipInstanceService.createBasedOnGameConfigs.mockResolvedValue(instances);
      (
        shipPositionService.initializeShipPositions as jest.Mock
      ).mockReturnValue([]);
      queryRunner.manager.save.mockResolvedValueOnce(undefined);

      const result = await service.startGame();

      expect(result.ships).toHaveLength(2);
    });

    it('should rollback and throw on ship placement failure', async () => {
      queryRunner.manager.save.mockResolvedValueOnce(createMockGame());
      shipInstanceService.createBasedOnGameConfigs.mockResolvedValue([]);
      (
        shipPositionService.initializeShipPositions as jest.Mock
      ).mockImplementation(() => {
        throw new Error('Failed to place ship');
      });

      await expect(service.startGame()).rejects.toThrow(
        InternalServerErrorException,
      );
      expect(queryRunner.rollbackTransaction).toHaveBeenCalled();
      expect(queryRunner.release).toHaveBeenCalled();
    });

    it('should rollback and throw generic error on unexpected failure', async () => {
      queryRunner.manager.save.mockRejectedValueOnce(new Error('DB error'));

      await expect(service.startGame()).rejects.toThrow(
        InternalServerErrorException,
      );
      expect(queryRunner.rollbackTransaction).toHaveBeenCalled();
    });
  });

  describe('shoot', () => {
    const dto = { gameId: 'game-1', position: 'A1' };

    it('should return ALREADY_SHOT if position was already shot', async () => {
      const game = createMockGame();
      gameRepository.findOne.mockResolvedValue(game);
      shotService.findByGameAndPosition.mockResolvedValue(createMockShot());

      const result = await service.shoot(dto);

      expect(result.result).toBe('ALREADY_SHOT');
      expect(queryRunner.rollbackTransaction).toHaveBeenCalled();
    });

    it('should return MISS when no ship at position', async () => {
      const game = createMockGame();
      gameRepository.findOne.mockResolvedValue(game);
      shotService.findByGameAndPosition.mockResolvedValue(null);
      (
        shipPositionService.findByPositionAndGame as jest.Mock
      ).mockResolvedValue(null);

      const result = await service.shoot(dto);

      expect(result.result).toBe('MISS');
      expect(result.gameOver).toBe(false);
      expect(queryRunner.commitTransaction).toHaveBeenCalled();
    });

    it('should change game status to IN_PROGRESS on first shot', async () => {
      const game = createMockGame({ status: 'NOT_STARTED' });
      gameRepository.findOne.mockResolvedValue(game);
      shotService.findByGameAndPosition.mockResolvedValue(null);
      (
        shipPositionService.findByPositionAndGame as jest.Mock
      ).mockResolvedValue(null);

      await service.shoot(dto);

      expect(queryRunner.manager.save).toHaveBeenCalledWith(
        GameEntity,
        expect.objectContaining({ status: 'IN_PROGRESS' }),
      );
    });

    it('should not change status if already IN_PROGRESS', async () => {
      const game = createMockGame({ status: 'IN_PROGRESS' });
      gameRepository.findOne.mockResolvedValue(game);
      shotService.findByGameAndPosition.mockResolvedValue(null);
      (
        shipPositionService.findByPositionAndGame as jest.Mock
      ).mockResolvedValue(null);

      await service.shoot(dto);

      // save should only be called for the shot, not for game status change
      expect(queryRunner.manager.save).not.toHaveBeenCalledWith(
        GameEntity,
        expect.objectContaining({ status: 'IN_PROGRESS' }),
      );
    });

    it('should return HIT when ship is at position but not sunk', async () => {
      const game = createMockGame({ status: 'IN_PROGRESS' });
      const shipPosition = createMockShipPosition();
      gameRepository.findOne.mockResolvedValue(game);
      shotService.findByGameAndPosition.mockResolvedValue(null);
      (
        shipPositionService.findByPositionAndGame as jest.Mock
      ).mockResolvedValue(shipPosition);
      shipInstanceService.applyHit.mockResolvedValue({
        isSunk: false,
        shipTypeName: 'Battleship',
      });

      const result = await service.shoot(dto);

      expect(result.result).toBe('HIT');
      expect(result.shipSunk).toBeUndefined();
      expect(result.gameOver).toBe(false);
    });

    it('should return HIT with shipSunk when ship is sunk', async () => {
      const game = createMockGame({ status: 'IN_PROGRESS' });
      const shipPosition = createMockShipPosition();
      gameRepository.findOne.mockResolvedValue(game);
      shotService.findByGameAndPosition.mockResolvedValue(null);
      (
        shipPositionService.findByPositionAndGame as jest.Mock
      ).mockResolvedValue(shipPosition);
      shipInstanceService.applyHit.mockResolvedValue({
        isSunk: true,
        shipTypeName: 'Battleship',
      });
      shipInstanceService.countUnsunkByGame.mockResolvedValue(2);

      const result = await service.shoot(dto);

      expect(result.result).toBe('HIT');
      expect(result.shipSunk).toBe('Battleship');
      expect(result.gameOver).toBe(false);
    });

    it('should set gameOver when last ship is sunk', async () => {
      const game = createMockGame({ status: 'IN_PROGRESS' });
      const shipPosition = createMockShipPosition();
      gameRepository.findOne.mockResolvedValue(game);
      shotService.findByGameAndPosition.mockResolvedValue(null);
      (
        shipPositionService.findByPositionAndGame as jest.Mock
      ).mockResolvedValue(shipPosition);
      shipInstanceService.applyHit.mockResolvedValue({
        isSunk: true,
        shipTypeName: 'Destroyer',
      });
      shipInstanceService.countUnsunkByGame.mockResolvedValue(0);

      const result = await service.shoot(dto);

      expect(result.result).toBe('HIT');
      expect(result.gameOver).toBe(true);
      expect(game.status).toBe('COMPLETED');
    });

    it('should throw NotFoundException if game not found', async () => {
      gameRepository.findOne.mockResolvedValue(null);
      await expect(service.shoot(dto)).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if game is completed', async () => {
      gameRepository.findOne.mockResolvedValue(
        createMockGame({ status: 'COMPLETED' }),
      );
      await expect(service.shoot(dto)).rejects.toThrow(BadRequestException);
    });

    it('should rollback on unexpected error during shot processing', async () => {
      const game = createMockGame();
      gameRepository.findOne.mockResolvedValue(game);
      shotService.findByGameAndPosition.mockRejectedValue(
        new Error('DB error'),
      );

      await expect(service.shoot(dto)).rejects.toThrow(
        InternalServerErrorException,
      );
      expect(queryRunner.rollbackTransaction).toHaveBeenCalled();
    });
  });

  describe('getGameState', () => {
    it('should return game state with shots and ships remaining', async () => {
      const game = createMockGame({ status: 'IN_PROGRESS' });
      gameRepository.findOne.mockResolvedValue(game);
      shotService.findAllByGame.mockResolvedValue([
        createMockShot({ position: 'A1', success: true }),
        createMockShot({ position: 'B1', success: false }),
      ]);
      shipInstanceService.countUnsunkByGame.mockResolvedValue(3);

      const result = await service.getGameState('game-1');

      expect(result.gameId).toBe('game-1');
      expect(result.status).toBe('IN_PROGRESS');
      expect(result.shots).toHaveLength(2);
      expect(result.shipsRemaining).toBe(3);
    });

    it('should throw NotFoundException if game not found', async () => {
      gameRepository.findOne.mockResolvedValue(null);
      await expect(service.getGameState('not-exist')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
