import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1780393230347 implements MigrationInterface {
	name = 'Init1780393230347';

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`CREATE TABLE \`fixed_entity\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
		);
		await queryRunner.query(
			`CREATE TABLE \`comment\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`content\` text NOT NULL, \`blogId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
		);
		await queryRunner.query(
			`CREATE TABLE \`content_skill\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`title\` varchar(255) NOT NULL, \`proficiency\` int NOT NULL, \`content_id\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
		);
		await queryRunner.query(
			`CREATE TABLE \`content\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`footer_links\` text NULL, \`footer_caption\` varchar(255) NULL, \`footer_mobile\` varchar(255) NULL, \`footer_email\` varchar(255) NULL, \`footer_telegram\` varchar(255) NULL, \`footer_whatsapp\` varchar(255) NULL, \`header_h1_title\` varchar(255) NULL, \`header_caption\` varchar(255) NULL, \`footer_logo_id\` int NULL, \`header_avatar_image_id\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
		);
		await queryRunner.query(
			`CREATE TABLE \`media\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`title\` varchar(255) NOT NULL, \`type\` enum ('image', 'video') NOT NULL DEFAULT 'image', \`url\` varchar(255) NOT NULL, \`disable\` tinyint NOT NULL DEFAULT 0, \`blog_id\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
		);
		await queryRunner.query(
			`CREATE TABLE \`user\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`name\` varchar(255) NULL, \`mobile\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`plainPassword\` varchar(255) NOT NULL, \`roles\` text NOT NULL, UNIQUE INDEX \`IDX_29fd51e9cf9241d022c5a4e02e\` (\`mobile\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
		);
		await queryRunner.query(
			`CREATE TABLE \`blog\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`title\` varchar(255) NOT NULL, \`slug\` varchar(255) NOT NULL, \`description\` text NOT NULL, \`seo_keywords\` text NULL, \`seo_short_description\` varchar(255) NULL, \`view_count\` int NOT NULL DEFAULT '0', \`like_count\` int NOT NULL DEFAULT '0', \`userId\` int NOT NULL, UNIQUE INDEX \`IDX_0dc7e58d73a1390874a663bd59\` (\`slug\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
		);
		await queryRunner.query(
			`CREATE TABLE \`content_header_slider_images\` (\`content_id\` int NOT NULL, \`media_id\` int NOT NULL, INDEX \`IDX_8513d502cdfcfeae1467a7ea04\` (\`content_id\`), INDEX \`IDX_287683bdc269199a4320d5fdab\` (\`media_id\`), PRIMARY KEY (\`content_id\`, \`media_id\`)) ENGINE=InnoDB`,
		);
		await queryRunner.query(
			`ALTER TABLE \`comment\` ADD CONSTRAINT \`FK_5dec255234c5b7418f3d1e88ce4\` FOREIGN KEY (\`blogId\`) REFERENCES \`blog\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE \`content_skill\` ADD CONSTRAINT \`FK_8f0b45066fb170b0716a6f9568c\` FOREIGN KEY (\`content_id\`) REFERENCES \`content\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE \`content\` ADD CONSTRAINT \`FK_8b8a755855f7e6d88e5081561ce\` FOREIGN KEY (\`footer_logo_id\`) REFERENCES \`media\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE \`content\` ADD CONSTRAINT \`FK_85b67ace4788b66ff42853d8107\` FOREIGN KEY (\`header_avatar_image_id\`) REFERENCES \`media\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE \`media\` ADD CONSTRAINT \`FK_5ec46f0908fd709b5053c77d522\` FOREIGN KEY (\`blog_id\`) REFERENCES \`blog\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE \`blog\` ADD CONSTRAINT \`FK_fc46ede0f7ab797b7ffacb5c08d\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE \`content_header_slider_images\` ADD CONSTRAINT \`FK_8513d502cdfcfeae1467a7ea048\` FOREIGN KEY (\`content_id\`) REFERENCES \`content\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
		);
		await queryRunner.query(
			`ALTER TABLE \`content_header_slider_images\` ADD CONSTRAINT \`FK_287683bdc269199a4320d5fdab1\` FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TABLE \`content_header_slider_images\` DROP FOREIGN KEY \`FK_287683bdc269199a4320d5fdab1\``,
		);
		await queryRunner.query(
			`ALTER TABLE \`content_header_slider_images\` DROP FOREIGN KEY \`FK_8513d502cdfcfeae1467a7ea048\``,
		);
		await queryRunner.query(
			`ALTER TABLE \`blog\` DROP FOREIGN KEY \`FK_fc46ede0f7ab797b7ffacb5c08d\``,
		);
		await queryRunner.query(
			`ALTER TABLE \`media\` DROP FOREIGN KEY \`FK_5ec46f0908fd709b5053c77d522\``,
		);
		await queryRunner.query(
			`ALTER TABLE \`content\` DROP FOREIGN KEY \`FK_85b67ace4788b66ff42853d8107\``,
		);
		await queryRunner.query(
			`ALTER TABLE \`content\` DROP FOREIGN KEY \`FK_8b8a755855f7e6d88e5081561ce\``,
		);
		await queryRunner.query(
			`ALTER TABLE \`content_skill\` DROP FOREIGN KEY \`FK_8f0b45066fb170b0716a6f9568c\``,
		);
		await queryRunner.query(
			`ALTER TABLE \`comment\` DROP FOREIGN KEY \`FK_5dec255234c5b7418f3d1e88ce4\``,
		);
		await queryRunner.query(
			`DROP INDEX \`IDX_287683bdc269199a4320d5fdab\` ON \`content_header_slider_images\``,
		);
		await queryRunner.query(
			`DROP INDEX \`IDX_8513d502cdfcfeae1467a7ea04\` ON \`content_header_slider_images\``,
		);
		await queryRunner.query(`DROP TABLE \`content_header_slider_images\``);
		await queryRunner.query(
			`DROP INDEX \`IDX_0dc7e58d73a1390874a663bd59\` ON \`blog\``,
		);
		await queryRunner.query(`DROP TABLE \`blog\``);
		await queryRunner.query(
			`DROP INDEX \`IDX_29fd51e9cf9241d022c5a4e02e\` ON \`user\``,
		);
		await queryRunner.query(`DROP TABLE \`user\``);
		await queryRunner.query(`DROP TABLE \`media\``);
		await queryRunner.query(`DROP TABLE \`content\``);
		await queryRunner.query(`DROP TABLE \`content_skill\``);
		await queryRunner.query(`DROP TABLE \`comment\``);
		await queryRunner.query(`DROP TABLE \`fixed_entity\``);
	}
}
