import { MigrationInterface, QueryRunner } from "typeorm";

export class AddDisableFieldBlog1780490522431 implements MigrationInterface {
    name = 'AddDisableFieldBlog1780490522431'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`blog\` ADD \`disable\` tinyint NOT NULL DEFAULT 1`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`blog\` DROP COLUMN \`disable\``);
    }

}
