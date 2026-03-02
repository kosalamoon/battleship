import { Test, TestingModule } from '@nestjs/testing';
import { ShipPositionService } from './ship-position.service';

describe('ShipPositionService', () => {
  let service: ShipPositionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ShipPositionService],
    }).compile();

    service = module.get<ShipPositionService>(ShipPositionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
