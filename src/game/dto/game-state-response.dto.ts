export class ShotSummaryDto {
  position: string;
  success: boolean;
}

export class GameStateResponseDto {
  gameId: string;
  status: string;
  gridSize: number;
  shots: ShotSummaryDto[];
  shipsRemaining: number;
}
