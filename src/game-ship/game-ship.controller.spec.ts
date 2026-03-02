import { Test, TestingModule } from '@nestjs/testing';
import { GameShipController } from './game-ship.controller';
import { GameShipService } from './game-ship.service';

describe('GameShipController', () => {
  let controller: GameShipController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GameShipController],
      providers: [GameShipService],
    }).compile();

    controller = module.get<GameShipController>(GameShipController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
