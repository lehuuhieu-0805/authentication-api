import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitDb1681381878343 implements MigrationInterface {
  name = 'InitDb1681381878343';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "users" ("email" nvarchar(255) NOT NULL, "password" nvarchar(255) NOT NULL, "verifyCode" nvarchar(255) NOT NULL, "isVerified" bit NOT NULL, CONSTRAINT "PK_97672ac88f789774dd47f7c8be3" PRIMARY KEY ("email"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
