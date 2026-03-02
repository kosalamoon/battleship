export class ShipSummaryDto {
  shipType: string;
  size: number;
  count: number;
}

export class StartGameResponseDto {
  gameId: string;
  status: string;
  gridSize: number;
  ships: ShipSummaryDto[];
}
