import { Test, TestingModule } from '@nestjs/testing';
import { ShipInstanceController } from './ship-instance.controller';
import { ShipInstanceService } from './ship-instance.service';

describe('ShipInstanceController', () => {
  let controller: ShipInstanceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShipInstanceController],
      providers: [ShipInstanceService],
    }).compile();

    controller = module.get<ShipInstanceController>(ShipInstanceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
