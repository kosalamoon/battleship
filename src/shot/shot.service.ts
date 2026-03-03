import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GameEntity } from 'src/game/game.entity';
import { EntityManager, Repository } from 'typeorm';
import { ShotEntity } from './shot.entity';

@Injectable()
export class ShotService {
  constructor(
    @InjectRepository(ShotEntity)
    private readonly shotRepository: Repository<ShotEntity>,
  ) {}

  async findByGameAndPosition(
    gameId: string,
    position: string,
    manager: EntityManager,
  ): Promise<ShotEntity | null> {
    return manager.findOne(ShotEntity, {
      where: { game: { id: gameId }, position },
    });
  }

  async create(
    gameId: string,
    position: string,
    success: boolean,
    manager: EntityManager,
  ): Promise<void> {
    await manager.save(ShotEntity, {
      position,
      success,
      game: { id: gameId } as GameEntity,
    });
  }
}
