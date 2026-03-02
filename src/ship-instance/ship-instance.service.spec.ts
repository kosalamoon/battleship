import { Test, TestingModule } from '@nestjs/testing';
import { ShipInstanceService } from './ship-instance.service';

describe('ShipInstanceService', () => {
  let service: ShipInstanceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ShipInstanceService],
    }).compile();

    service = module.get<ShipInstanceService>(ShipInstanceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
