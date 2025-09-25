import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangedProductPriceType21758090617464 implements MigrationInterface {
    name = 'ChangedProductPriceType21758090617464'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`product\` MODIFY COLUMN \`price\` int NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`product\` DROP COLUMN \`price\``);
        await queryRunner.query(`ALTER TABLE \`product\` ADD \`price\` varchar(255) NOT NULL`);
    }

}
