import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ShotService } from './shot.service';
import { ShotEntity } from './shot.entity';
import {
  createMockRepository,
  createMockEntityManager,
  createMockShot,
} from '../test/mocks';

describe('ShotService', () => {
  let service: ShotService;
  let shotRepository: ReturnType<typeof createMockRepository>;
  let manager: ReturnType<typeof createMockEntityManager>;

  beforeEach(async () => {
    shotRepository = createMockRepository();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ShotService,
        { provide: getRepositoryToken(ShotEntity), useValue: shotRepository },
      ],
    }).compile();

    service = module.get<ShotService>(ShotService);
    manager = createMockEntityManager();
  });

  describe('findByGameAndPosition', () => {
    it('should return shot if found', async () => {
      const shot = createMockShot();
      manager.findOne.mockResolvedValue(shot);

      const result = await service.findByGameAndPosition(
        'game-1',
        'A1',
        manager as any,
      );

      expect(result).toEqual(shot);
    });

    it('should return null if not found', async () => {
      manager.findOne.mockResolvedValue(null);

      const result = await service.findByGameAndPosition(
        'game-1',
        'Z9',
        manager as any,
      );

      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    it('should save a new shot', async () => {
      manager.save.mockResolvedValue(undefined);

      await service.create('game-1', 'A1', true, manager as any);

      expect(manager.save).toHaveBeenCalledWith(ShotEntity, {
        position: 'A1',
        success: true,
        game: { id: 'game-1' },
      });
    });
  });

  describe('findAllByGame', () => {
    it('should return all shots for a game ordered by createdAt', async () => {
      const shots = [
        createMockShot({ position: 'A1' }),
        createMockShot({ position: 'B2' }),
      ];
      shotRepository.find.mockResolvedValue(shots);

      const result = await service.findAllByGame('game-1');

      expect(result).toEqual(shots);
      expect(shotRepository.find).toHaveBeenCalledWith({
        where: { game: { id: 'game-1' } },
        order: { createdAt: 'ASC' },
      });
    });
  });
});
