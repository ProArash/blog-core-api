import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangedProductPriceType31758090750405 implements MigrationInterface {
    name = 'ChangedProductPriceType31758090750405'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`product\` MODIFY COLUMN \`price\` varchar(255) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`product\` DROP COLUMN \`price\``);
        await queryRunner.query(`ALTER TABLE \`product\` ADD \`price\` int NOT NULL`);
    }

}
