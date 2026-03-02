import { Test, TestingModule } from '@nestjs/testing';
import { GameShipService } from './game-ship.service';

describe('GameShipService', () => {
  let service: GameShipService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GameShipService],
    }).compile();

    service = module.get<GameShipService>(GameShipService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
