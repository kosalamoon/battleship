import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { GameConfigService } from './game-config.service';
import { GameConfigEntity } from './game-config.entity';
import {
  createMockRepository,
  createMockEntityManager,
  createMockGameConfig,
} from '../test/mocks';

describe('GameConfigService', () => {
  let service: GameConfigService;
  let repository: ReturnType<typeof createMockRepository>;

  beforeEach(async () => {
    repository = createMockRepository();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GameConfigService,
        { provide: getRepositoryToken(GameConfigEntity), useValue: repository },
      ],
    }).compile();

    service = module.get<GameConfigService>(GameConfigService);
  });

  describe('findAll', () => {
    it('should return configs using repository when no manager provided', async () => {
      const configs = [createMockGameConfig()];
      repository.find.mockResolvedValue(configs);

      const result = await service.findAll();

      expect(result).toEqual(configs);
      expect(repository.find).toHaveBeenCalledWith({
        relations: ['shipType'],
      });
    });

    it('should return configs using manager when provided', async () => {
      const manager = createMockEntityManager();
      const configs = [createMockGameConfig()];
      manager.find.mockResolvedValue(configs);

      const result = await service.findAll(manager as any);

      expect(result).toEqual(configs);
      expect(manager.find).toHaveBeenCalled();
      expect(repository.find).not.toHaveBeenCalled();
    });
  });
});
