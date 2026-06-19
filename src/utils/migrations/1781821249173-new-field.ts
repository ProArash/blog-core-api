import { MigrationInterface, QueryRunner } from "typeorm";

export class NewField1781821249173 implements MigrationInterface {
    name = 'NewField1781821249173'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_0dc7e58d73a1390874a663bd59\` ON \`blog\``);
        await queryRunner.query(`ALTER TABLE \`blog\` DROP COLUMN \`seo_keywords\``);
        await queryRunner.query(`ALTER TABLE \`blog\` DROP COLUMN \`seo_short_description\``);
        await queryRunner.query(`ALTER TABLE \`blog\` DROP COLUMN \`disable\``);
        await queryRunner.query(`ALTER TABLE \`blog\` ADD \`canonical_url\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`blog\` ADD \`noindex\` tinyint NOT NULL DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE \`blog\` ADD \`nofollow\` tinyint NOT NULL DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE \`blog\` ADD \`status\` enum ('draft', 'published', 'archived') NOT NULL DEFAULT 'draft'`);
        await queryRunner.query(`ALTER TABLE \`blog\` ADD \`published_at\` timestamp NULL`);
        await queryRunner.query(`ALTER TABLE \`blog\` ADD \`featuredImageId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`blog\` ADD UNIQUE INDEX \`IDX_0dc7e58d73a1390874a663bd59\` (\`slug\`)`);
        await queryRunner.query(`CREATE INDEX \`IDX_4f9cc1f9feadd3a4e68302d46f\` ON \`blog\` (\`noindex\`)`);
        await queryRunner.query(`CREATE INDEX \`IDX_e9da73f0ea0d7f197aa7884e1a\` ON \`blog\` (\`status\`)`);
        await queryRunner.query(`CREATE INDEX \`IDX_06ccc7536f4cea53c7a3da0784\` ON \`blog\` (\`published_at\`)`);
        await queryRunner.query(`ALTER TABLE \`blog\` ADD CONSTRAINT \`FK_c92410dc431bce5c1f54e896912\` FOREIGN KEY (\`featuredImageId\`) REFERENCES \`media\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`blog\` DROP FOREIGN KEY \`FK_c92410dc431bce5c1f54e896912\``);
        await queryRunner.query(`DROP INDEX \`IDX_06ccc7536f4cea53c7a3da0784\` ON \`blog\``);
        await queryRunner.query(`DROP INDEX \`IDX_e9da73f0ea0d7f197aa7884e1a\` ON \`blog\``);
        await queryRunner.query(`DROP INDEX \`IDX_4f9cc1f9feadd3a4e68302d46f\` ON \`blog\``);
        await queryRunner.query(`ALTER TABLE \`blog\` DROP INDEX \`IDX_0dc7e58d73a1390874a663bd59\``);
        await queryRunner.query(`ALTER TABLE \`blog\` DROP COLUMN \`featuredImageId\``);
        await queryRunner.query(`ALTER TABLE \`blog\` DROP COLUMN \`published_at\``);
        await queryRunner.query(`ALTER TABLE \`blog\` DROP COLUMN \`status\``);
        await queryRunner.query(`ALTER TABLE \`blog\` DROP COLUMN \`nofollow\``);
        await queryRunner.query(`ALTER TABLE \`blog\` DROP COLUMN \`noindex\``);
        await queryRunner.query(`ALTER TABLE \`blog\` DROP COLUMN \`canonical_url\``);
        await queryRunner.query(`ALTER TABLE \`blog\` ADD \`disable\` tinyint NOT NULL DEFAULT '1'`);
        await queryRunner.query(`ALTER TABLE \`blog\` ADD \`seo_short_description\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`blog\` ADD \`seo_keywords\` text NULL`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_0dc7e58d73a1390874a663bd59\` ON \`blog\` (\`slug\`)`);
    }

}
