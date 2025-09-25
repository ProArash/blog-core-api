import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangedProductPriceType41758090811714
	implements MigrationInterface
{
	name = 'ChangedProductPriceType41758090811714';

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TABLE \`product\` MODIFY COLUMN \`price\` double NOT NULL`,
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`ALTER TABLE \`product\` DROP COLUMN \`price\``);
		await queryRunner.query(
			`ALTER TABLE \`product\` ADD \`price\` varchar(255) NOT NULL`,
		);
	}
}
