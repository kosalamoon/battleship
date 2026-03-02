import { MigrationInterface, QueryRunner } from 'typeorm';

export class MigrationFile1772478606713 implements MigrationInterface {
  name = 'MigrationFile1772478606713';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "game" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "status" character varying NOT NULL DEFAULT 'NOT_STARTED', "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_352a30652cd352f552fef73dec5" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "shot" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "position" character varying NOT NULL, "success" boolean NOT NULL, "game_id" uuid, CONSTRAINT "PK_270d8a54e9ae132b9368e0d93a7" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "ship_type" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "size" integer NOT NULL, CONSTRAINT "PK_2c1eccdecab9a19f8262d2e5f04" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "ship_instance" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "hit_count" integer NOT NULL, "is_sunk" boolean NOT NULL, "game_id" uuid, "ship_type_id" uuid, CONSTRAINT "PK_a968b9c566496d0d6d0879844da" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "ship_position" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "position" character varying NOT NULL, "is_hit" boolean NOT NULL, "ship_instance_id" uuid, CONSTRAINT "PK_60eb4839791826e927e38102a92" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "game_config" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "count" integer NOT NULL, "ship_type_id" uuid, CONSTRAINT "PK_6572e2a84c4c5d72a9227e0b894" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "shot" ADD CONSTRAINT "FK_b899b4839d21df89425415ca1b4" FOREIGN KEY ("game_id") REFERENCES "game"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "ship_instance" ADD CONSTRAINT "FK_463fe30020a883d264216120d43" FOREIGN KEY ("game_id") REFERENCES "game"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "ship_instance" ADD CONSTRAINT "FK_8614fa80f613a9a5043f7f7faec" FOREIGN KEY ("ship_type_id") REFERENCES "ship_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "ship_position" ADD CONSTRAINT "FK_34775e218fad6a5633b1362ce26" FOREIGN KEY ("ship_instance_id") REFERENCES "ship_instance"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "game_config" ADD CONSTRAINT "FK_6fbb80eecb8d07f5fe25f6739b2" FOREIGN KEY ("ship_type_id") REFERENCES "ship_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "game_config" DROP CONSTRAINT "FK_6fbb80eecb8d07f5fe25f6739b2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ship_position" DROP CONSTRAINT "FK_34775e218fad6a5633b1362ce26"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ship_instance" DROP CONSTRAINT "FK_8614fa80f613a9a5043f7f7faec"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ship_instance" DROP CONSTRAINT "FK_463fe30020a883d264216120d43"`,
    );
    await queryRunner.query(
      `ALTER TABLE "shot" DROP CONSTRAINT "FK_b899b4839d21df89425415ca1b4"`,
    );
    await queryRunner.query(`DROP TABLE "game_config"`);
    await queryRunner.query(`DROP TABLE "ship_position"`);
    await queryRunner.query(`DROP TABLE "ship_instance"`);
    await queryRunner.query(`DROP TABLE "ship_type"`);
    await queryRunner.query(`DROP TABLE "shot"`);
    await queryRunner.query(`DROP TABLE "game"`);
  }
}
