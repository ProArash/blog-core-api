import { Column, Entity, ManyToOne } from 'typeorm';
import { FixedEntity } from '../../../utils/entities/fixed.entity';
import { PayStatus } from './pay.status';
import { UserEntity } from '../../user/entities/user.entity';
import { PlanEntity } from '../../plan/entities/plan.entity';

@Entity()
export class InvoiceEntity extends FixedEntity {
	@Column({
		default: PayStatus.PENDING,
	})
	status: PayStatus;

	@Column({
		nullable: true,
	})
	trackId: string;

	@ManyToOne(() => UserEntity, (user) => user.invoices)
	user: UserEntity;

	@ManyToOne(() => PlanEntity, (plan) => plan.invoices)
	plan: PlanEntity;
}
