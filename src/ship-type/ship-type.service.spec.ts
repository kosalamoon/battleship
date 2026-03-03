import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ShipTypeService } from './ship-type.service';
import { ShipTypeEntity } from './ship-type.entity';
import {
  createMockRepository,
  createMockShipType,
  createMockEntityManager,
} from '../test/mocks';

describe('ShipTypeService', () => {
  let service: ShipTypeService;
  let repository: ReturnType<typeof createMockRepository>;

  beforeEach(async () => {
    repository = createMockRepository();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ShipTypeService,
        { provide: getRepositoryToken(ShipTypeEntity), useValue: repository },
      ],
    }).compile();

    service = module.get<ShipTypeService>(ShipTypeService);
  });

  describe('findByName', () => {
    it('should find ship type by name using repository', async () => {
      const shipType = createMockShipType({ name: 'Battleship' });
      repository.findOne.mockResolvedValue(shipType);

      const result = await service.findByName('Battleship');

      expect(result).toEqual(shipType);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { name: 'Battleship' },
      });
    });

    it('should use manager when provided', async () => {
      const manager = createMockEntityManager();
      const shipType = createMockShipType({ name: 'Cruiser' });
      manager.findOne.mockResolvedValue(shipType);

      const result = await service.findByName('Cruiser', manager as any);

      expect(result).toEqual(shipType);
      expect(manager.findOne).toHaveBeenCalled();
      expect(repository.findOne).not.toHaveBeenCalled();
    });

    it('should return null when not found', async () => {
      repository.findOne.mockResolvedValue(null);

      const result = await service.findByName('NonExistent');

      expect(result).toBeNull();
    });
  });
});
