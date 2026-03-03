import { IsNotEmpty, IsUUID, Matches } from 'class-validator';

export class ShootRequestDto {
  @IsUUID()
  @IsNotEmpty()
  gameId: string;

  @IsNotEmpty()
  @Matches(/^[A-J](10|[1-9])$/, {
    message: 'position must be in format A1-J10',
  })
  position: string;
}
