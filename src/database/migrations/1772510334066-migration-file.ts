import { MigrationInterface, QueryRunner } from 'typeorm';

export class MigrationFile1772510334066 implements MigrationInterface {
  name = 'MigrationFile1772510334066';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "ship_type" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "ship_type" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "game_config" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "game_config" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "game" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "shot" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "shot" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "ship_instance" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "ship_instance" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "ship_position" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "ship_position" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "ship_position" DROP COLUMN "updated_at"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ship_position" DROP COLUMN "created_at"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ship_instance" DROP COLUMN "updated_at"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ship_instance" DROP COLUMN "created_at"`,
    );
    await queryRunner.query(`ALTER TABLE "shot" DROP COLUMN "updated_at"`);
    await queryRunner.query(`ALTER TABLE "shot" DROP COLUMN "created_at"`);
    await queryRunner.query(`ALTER TABLE "game" DROP COLUMN "updated_at"`);
    await queryRunner.query(
      `ALTER TABLE "game_config" DROP COLUMN "updated_at"`,
    );
    await queryRunner.query(
      `ALTER TABLE "game_config" DROP COLUMN "created_at"`,
    );
    await queryRunner.query(`ALTER TABLE "ship_type" DROP COLUMN "updated_at"`);
    await queryRunner.query(`ALTER TABLE "ship_type" DROP COLUMN "created_at"`);
  }
}
