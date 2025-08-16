import { Column, Entity, ManyToOne } from 'typeorm';
import { FixedEntity } from '../../../utils/entities/fixed.entity';
import { PlanEntity } from '../../plan/entities/plan.entity';
import { PortfolioEntity } from '../../portfolio/entities/portfolio.entity';

@Entity()
export class MediaEntity extends FixedEntity {
	@Column()
	mediaUrl: string;

	@ManyToOne(() => PlanEntity, (plan) => plan.medias, {
		onDelete: 'CASCADE',
	})
	plan: PlanEntity;

	@ManyToOne(() => PortfolioEntity, (portfolio) => portfolio.medias, {
		onDelete: 'CASCADE',
	})
	portfolio: PortfolioEntity;
}
