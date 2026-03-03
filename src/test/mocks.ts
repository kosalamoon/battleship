import { GameEntity } from '../game/game.entity';
import { ShipTypeEntity } from '../ship-type/ship-type.entity';
import { ShipInstanceEntity } from '../ship-instance/ship-instance.entity';
import { ShipPositionEntity } from '../ship-position/ship-position.entity';
import { ShotEntity } from '../shot/shot.entity';
import { GameConfigEntity } from '../game-config/game-config.entity';

export const createMockRepository = () => ({
  find: jest.fn(),
  findOne: jest.fn(),
  save: jest.fn(),
  count: jest.fn(),
  create: jest.fn(),
});

export const createMockEntityManager = () => ({
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  count: jest.fn(),
  create: jest.fn((_, entity) => entity),
});

export const createMockQueryRunner = (manager?: any) => ({
  connect: jest.fn(),
  startTransaction: jest.fn(),
  commitTransaction: jest.fn(),
  rollbackTransaction: jest.fn(),
  release: jest.fn(),
  manager: manager ?? createMockEntityManager(),
});

export const createMockDataSource = (queryRunner?: any) => {
  const qr = queryRunner ?? createMockQueryRunner();
  return {
    createQueryRunner: jest.fn().mockReturnValue(qr),
    manager: createMockEntityManager(),
    _queryRunner: qr,
  };
};

export const createMockShipType = (
  overrides: Partial<ShipTypeEntity> = {},
): ShipTypeEntity =>
  ({
    id: 'ship-type-1',
    name: 'Battleship',
    size: 4,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  }) as ShipTypeEntity;

export const createMockGame = (
  overrides: Partial<GameEntity> = {},
): GameEntity =>
  ({
    id: 'game-1',
    status: 'NOT_STARTED' as const,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  }) as GameEntity;

export const createMockShipInstance = (
  overrides: Partial<ShipInstanceEntity> = {},
): ShipInstanceEntity =>
  ({
    id: 'ship-instance-1',
    game: createMockGame(),
    shipType: createMockShipType(),
    hitCount: 0,
    isSunk: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  }) as ShipInstanceEntity;

export const createMockShipPosition = (
  overrides: Partial<ShipPositionEntity> = {},
): ShipPositionEntity =>
  ({
    id: 'ship-position-1',
    shipInstance: createMockShipInstance(),
    position: 'A1',
    isHit: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  }) as ShipPositionEntity;

export const createMockShot = (
  overrides: Partial<ShotEntity> = {},
): ShotEntity =>
  ({
    id: 'shot-1',
    position: 'A1',
    success: false,
    game: createMockGame(),
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  }) as ShotEntity;

export const createMockGameConfig = (
  overrides: Partial<GameConfigEntity> = {},
): GameConfigEntity =>
  ({
    id: 'config-1',
    name: 'Default',
    shipType: createMockShipType(),
    count: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  }) as GameConfigEntity;
