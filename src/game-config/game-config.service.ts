import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { GameConfigEntity } from './game-config.entity';

@Injectable()
export class GameConfigService {
  constructor(
    @InjectRepository(GameConfigEntity)
    private readonly gameConfigRepository: Repository<GameConfigEntity>,
  ) {}

  async findAll(manager?: EntityManager): Promise<GameConfigEntity[]> {
    if (manager) {
      return manager.find(GameConfigEntity, { relations: ['shipType'] });
    }
    return this.gameConfigRepository.find({ relations: ['shipType'] });
  }
}
