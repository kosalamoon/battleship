export class ShootResponseDto {
  gameId: string;
  position: string;
  result: 'HIT' | 'MISS' | 'ALREADY_SHOT';
  shipSunk?: string;
  gameOver: boolean;
  gameStatus: string;
}
