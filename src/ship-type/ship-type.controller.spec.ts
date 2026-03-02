import { Test, TestingModule } from '@nestjs/testing';
import { ShipTypeController } from './ship-type.controller';
import { ShipTypeService } from './ship-type.service';

describe('ShipTypeController', () => {
  let controller: ShipTypeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShipTypeController],
      providers: [ShipTypeService],
    }).compile();

    controller = module.get<ShipTypeController>(ShipTypeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
