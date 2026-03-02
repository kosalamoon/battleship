import { Test, TestingModule } from '@nestjs/testing';
import { ShipTypeService } from './ship-type.service';

describe('ShipTypeService', () => {
  let service: ShipTypeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ShipTypeService],
    }).compile();

    service = module.get<ShipTypeService>(ShipTypeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
