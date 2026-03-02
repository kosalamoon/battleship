import { Injectable } from '@nestjs/common';
import { ShipPositionEntity } from './ship-position.entity';
import { EntityManager, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

type CreateShipPosition = Omit<ShipPositionEntity, 'id'>;

@Injectable()
export class ShipPositionService {
  gridSize: number;
  maxPlacementAttempts: number;

  constructor(
    @InjectRepository(ShipPositionEntity)
    private readonly shipPositionRepository: Repository<ShipPositionEntity>,
    private readonly configService: ConfigService,
  ) {
    this.gridSize = this.configService.get<number>('GRID_SIZE', 10);
    this.maxPlacementAttempts = this.configService.get<number>(
      'MAX_PLACEMENT_ATTEMPTS',
      1000,
    );
  }

  async create(ship: CreateShipPosition, manager: EntityManager) {
    return manager.save(ship);
  }

  initializeShipPositions(value: { shipInstanceId: string; size: number }[]) {
    // Sort ship types by size in descending order to place larger ships first
    const sortedShipTypes = [...value].sort((a, b) => b.size - a.size);

    const occupiedPositions = new Set<string>();
    const finalPlacements: { shipInstanceId: string; position: string }[] = [];
    for (const shipType of sortedShipTypes) {
      let placed = false;

      let attempts = 0;
      while (!placed) {
        if (attempts >= this.maxPlacementAttempts) {
          throw new Error(
            `Failed to place ship ${shipType.shipInstanceId} after ${this.maxPlacementAttempts} attempts`,
          );
        }
        attempts++;

        const isHorizontal = Math.random() > 0.5;
        // limit the starting points
        const maxX = isHorizontal
          ? this.gridSize - shipType.size
          : this.gridSize - 1;
        const maxY = isHorizontal
          ? this.gridSize - 1
          : this.gridSize - shipType.size;

        const randomStartX = this.randomIntFromMax(maxX);
        const randomStartY = this.randomIntFromMax(maxY);

        const proposedPosition: string[] = [];
        let hasConflict = false;
        for (let i = 0; i < shipType.size; i++) {
          const currentX = isHorizontal ? randomStartX + i : randomStartX;
          const currentY = isHorizontal ? randomStartY : randomStartY + i;

          // Convert to text format (e.g. 00 -> A1)
          const positionString = `${this.numberToLetter(currentX)}${currentY + 1}`;

          if (occupiedPositions.has(positionString)) {
            hasConflict = true;
            break;
          }

          proposedPosition.push(positionString);
        }

        if (!hasConflict) {
          for (const position of proposedPosition) {
            occupiedPositions.add(position);
            finalPlacements.push({
              shipInstanceId: shipType.shipInstanceId,
              position,
            });
          }
          placed = true;
        }
      }
    }

    return finalPlacements;
  }

  private numberToLetter(num: number): string {
    return String.fromCharCode(65 + num);
  }

  private randomIntFromMax(max: number): number {
    return Math.floor(Math.random() * (max + 1)); // +1 -> to include max as well
  }
}
