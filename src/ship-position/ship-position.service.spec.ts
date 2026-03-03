import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { ShipPositionService } from './ship-position.service';
import { createMockEntityManager, createMockShipPosition } from '../test/mocks';

describe('ShipPositionService', () => {
  let service: ShipPositionService;
  let manager: ReturnType<typeof createMockEntityManager>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ShipPositionService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string, defaultVal: number) => {
              if (key === 'GRID_SIZE') return 10;
              if (key === 'MAX_PLACEMENT_ATTEMPTS') return 1000;
              return defaultVal;
            }),
          },
        },
      ],
    }).compile();

    service = module.get<ShipPositionService>(ShipPositionService);
    manager = createMockEntityManager();
  });

  describe('constructor', () => {
    it('should set gridSize and maxPlacementAttempts from config', () => {
      expect(service.gridSize).toBe(10);
      expect(service.maxPlacementAttempts).toBe(1000);
    });
  });

  describe('initializeShipPositions', () => {
    it('should place all ships without overlaps', () => {
      const args = [
        { shipInstanceId: 'si-1', size: 3 },
        { shipInstanceId: 'si-2', size: 2 },
      ];

      const result = service.initializeShipPositions(args);

      // Should have 3 + 2 = 5 positions
      expect(result).toHaveLength(5);

      // No duplicate positions
      const positions = result.map((r) => r.position);
      expect(new Set(positions).size).toBe(positions.length);

      // Correct ship assignments
      expect(result.filter((r) => r.shipInstanceId === 'si-1')).toHaveLength(3);
      expect(result.filter((r) => r.shipInstanceId === 'si-2')).toHaveLength(2);
    });

    it('should sort ships by size descending (largest first)', () => {
      // Alternate random values to avoid conflicts
      let callCount = 0;
      const randomSpy = jest.spyOn(Math, 'random').mockImplementation(() => {
        // Return different values for orientation, x, y to avoid overlap
        return [0.7, 0.0, 0.0, 0.7, 0.5, 0.5][callCount++ % 6];
      });

      const args = [
        { shipInstanceId: 'small', size: 2 },
        { shipInstanceId: 'large', size: 5 },
      ];

      const result = service.initializeShipPositions(args);

      // Large ship positions should appear first since it's placed first
      const largePositions = result
        .map((r, i) => ({ ...r, index: i }))
        .filter((r) => r.shipInstanceId === 'large');
      const smallPositions = result
        .map((r, i) => ({ ...r, index: i }))
        .filter((r) => r.shipInstanceId === 'small');

      expect(largePositions[0].index).toBeLessThan(smallPositions[0].index);

      randomSpy.mockRestore();
    });

    it('should throw error when placement fails after max attempts', () => {
      // Set very low max attempts
      service.maxPlacementAttempts = 0;

      expect(() =>
        service.initializeShipPositions([{ shipInstanceId: 'si-1', size: 3 }]),
      ).toThrow('Failed to place ship');
    });

    it('should generate valid position strings (A-J, 1-10)', () => {
      const args = [{ shipInstanceId: 'si-1', size: 5 }];
      const result = service.initializeShipPositions(args);

      for (const placement of result) {
        expect(placement.position).toMatch(/^[A-J](10|[1-9])$/);
      }
    });
  });

  describe('findByPositionAndGame', () => {
    it('should delegate to manager.findOne', async () => {
      const shipPosition = createMockShipPosition();
      manager.findOne.mockResolvedValue(shipPosition);

      const result = await service.findByPositionAndGame(
        'A1',
        'game-1',
        manager as any,
      );

      expect(result).toEqual(shipPosition);
      expect(manager.findOne).toHaveBeenCalled();
    });

    it('should return null when no position found', async () => {
      manager.findOne.mockResolvedValue(null);

      const result = await service.findByPositionAndGame(
        'Z9',
        'game-1',
        manager as any,
      );

      expect(result).toBeNull();
    });
  });

  describe('markAsHit', () => {
    it('should set isHit to true and save', async () => {
      const shipPosition = createMockShipPosition({ isHit: false });
      manager.save.mockResolvedValue(shipPosition);

      await service.markAsHit(shipPosition, manager as any);

      expect(shipPosition.isHit).toBe(true);
      expect(manager.save).toHaveBeenCalled();
    });
  });

  describe('create', () => {
    it('should save ship position via manager', async () => {
      const pos = createMockShipPosition();
      manager.save.mockResolvedValue(pos);

      const result = await service.create(pos as any, manager as any);

      expect(result).toEqual(pos);
      expect(manager.save).toHaveBeenCalledWith(pos);
    });
  });
});
