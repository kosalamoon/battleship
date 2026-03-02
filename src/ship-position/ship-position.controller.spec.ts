import { Test, TestingModule } from '@nestjs/testing';
import { ShipPositionController } from './ship-position.controller';
import { ShipPositionService } from './ship-position.service';

describe('ShipPositionController', () => {
  let controller: ShipPositionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShipPositionController],
      providers: [ShipPositionService],
    }).compile();

    controller = module.get<ShipPositionController>(ShipPositionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
