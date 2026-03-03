import { Test, TestingModule } from '@nestjs/testing';
import { ShipInstanceService } from './ship-instance.service';
import { GameConfigService } from '../game-config/game-config.service';
import {
  createMockEntityManager,
  createMockGame,
  createMockGameConfig,
  createMockShipInstance,
  createMockShipType,
} from '../test/mocks';

describe('ShipInstanceService', () => {
  let service: ShipInstanceService;
  let gameConfigService: Record<string, jest.Mock>;
  let manager: ReturnType<typeof createMockEntityManager>;

  beforeEach(async () => {
    gameConfigService = { findAll: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ShipInstanceService,
        { provide: GameConfigService, useValue: gameConfigService },
      ],
    }).compile();

    service = module.get<ShipInstanceService>(ShipInstanceService);
    manager = createMockEntityManager();
  });

  describe('createBasedOnGameConfigs', () => {
    it('should create correct number of ship instances from configs', async () => {
      const destroyer = createMockShipType({ name: 'Destroyer', size: 2 });
      const cruiser = createMockShipType({ name: 'Cruiser', size: 3 });
      const configs = [
        createMockGameConfig({ shipType: destroyer, count: 2 }),
        createMockGameConfig({ shipType: cruiser, count: 1 }),
      ];
      gameConfigService.findAll.mockResolvedValue(configs);

      const game = createMockGame();
      const savedInstance = createMockShipInstance();
      manager.save.mockResolvedValue(savedInstance);

      const result = await service.createBasedOnGameConfigs(
        game,
        manager as any,
      );

      expect(result).toHaveLength(3); // 2 destroyers + 1 cruiser
      expect(manager.save).toHaveBeenCalledTimes(3);
    });
  });

  describe('applyHit', () => {
    it('should increment hitCount and not sink if hits < size', async () => {
      const shipInstance = createMockShipInstance({
        hitCount: 0,
        shipType: createMockShipType({ size: 3 }),
      });
      manager.save.mockResolvedValue(shipInstance);

      const result = await service.applyHit(shipInstance, manager as any);

      expect(shipInstance.hitCount).toBe(1);
      expect(result.isSunk).toBe(false);
    });

    it('should mark as sunk when hits >= size', async () => {
      const shipInstance = createMockShipInstance({
        hitCount: 2,
        isSunk: false,
        shipType: createMockShipType({ size: 3, name: 'Cruiser' }),
      });
      manager.save.mockResolvedValue(shipInstance);

      const result = await service.applyHit(shipInstance, manager as any);

      expect(shipInstance.hitCount).toBe(3);
      expect(shipInstance.isSunk).toBe(true);
      expect(result.isSunk).toBe(true);
      expect(result.shipTypeName).toBe('Cruiser');
    });
  });

  describe('countUnsunkByGame', () => {
    it('should return count of unsunk ships', async () => {
      manager.count.mockResolvedValue(5);

      const result = await service.countUnsunkByGame('game-1', manager as any);

      expect(result).toBe(5);
      expect(manager.count).toHaveBeenCalled();
    });
  });
});
