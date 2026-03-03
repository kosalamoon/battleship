import { MigrationInterface, QueryRunner } from 'typeorm';

export class MigrationFile1772523244948 implements MigrationInterface {
  name = 'MigrationFile1772523244948';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "ship_type" ADD CONSTRAINT "UQ_f6ebf650f426a1c67e301deaaca" UNIQUE ("name")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_8614fa80f613a9a5043f7f7fae" ON "ship_instance" ("ship_type_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_0a31ac1b95765705f67dc3d5b7" ON "ship_instance" ("game_id", "is_sunk") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_93301ab70c16c9f8b827ced7fc" ON "ship_position" ("ship_instance_id", "position") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_78bb65b6f236cae30280d5a258" ON "shot" ("game_id", "created_at") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_01358ea64ef172b84bc3c687d3" ON "shot" ("game_id", "position") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_6fbb80eecb8d07f5fe25f6739b" ON "game_config" ("ship_type_id") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."IDX_6fbb80eecb8d07f5fe25f6739b"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_01358ea64ef172b84bc3c687d3"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_78bb65b6f236cae30280d5a258"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_93301ab70c16c9f8b827ced7fc"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_0a31ac1b95765705f67dc3d5b7"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_8614fa80f613a9a5043f7f7fae"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ship_type" DROP CONSTRAINT "UQ_f6ebf650f426a1c67e301deaaca"`,
    );
  }
}
