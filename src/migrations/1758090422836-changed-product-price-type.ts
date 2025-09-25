import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangedProductPriceType1758090422836
	implements MigrationInterface
{
	name = 'ChangedProductPriceType1758090422836';

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TABLE \`product\` MODIFY COLUMN \`price\` varchar(255) NOT NULL`,
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`ALTER TABLE \`product\` DROP COLUMN \`price\``);
		await queryRunner.query(
			`ALTER TABLE \`product\` ADD \`price\` double(22) NOT NULL`,
		);
	}
}
