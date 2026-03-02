/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { MigrationInterface, QueryRunner } from 'typeorm';

export class MigrationFile1772475030866 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `INSERT INTO "ship_type" (name, size) VALUES ('Destroyer', 4), ('Battleship', 5)`,
    );
    const [destroyer]: { id: string }[] = await queryRunner.query(
      `SELECT id FROM ship_type WHERE name = 'Destroyer'`,
    );
    await queryRunner.query(
      `INSERT INTO "game_config" (name, count, ship_type_id) VALUES ($1, $2, $3)`,
      ['DEFAULT_CONFIG', 2, destroyer.id],
    );

    const [battleship]: { id: string }[] = await queryRunner.query(
      `SELECT id FROM ship_type WHERE name = 'Battleship'`,
    );
    await queryRunner.query(
      `INSERT INTO "game_config" (name, count, ship_type_id) VALUES ($1, $2, $3)`,
      ['DEFAULT_CONFIG', 2, battleship.id],
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
