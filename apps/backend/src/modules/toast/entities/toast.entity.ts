import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  HasMany,
  PrimaryKey,
  HasOne,
} from 'sequelize-typescript';
import { User } from '../../user/entities/user.entity';
import { Invite } from '../../invite/entities/invite.entity';
import { Accusation } from '../../accusation/entities/accusation.entity';
import { ToastLocation } from './toast-location.enum';

@Table({ tableName: 'toasts' })
export class Toast extends Model<Partial<Toast>> {
  @PrimaryKey
  @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4 })
  id!: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  title?: string | null;

  @Column({ allowNull: false })
  reason!: string;

  @Column({ type: DataType.DATE, allowNull: false })
  dueDate!: Date;

  @Column({ defaultValue: false })
  isDone!: boolean;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: false })
  userId!: string;

  @BelongsTo(() => User)
  creator!: User;

  @Column({ type: DataType.ARRAY(DataType.TEXT), defaultValue: [] })
  foods!: string[];

  @Column({ type: DataType.ARRAY(DataType.TEXT), defaultValue: [] })
  drinks!: string[];

  @Column({
    type: DataType.ENUM(...Object.values(ToastLocation)),
    allowNull: false,
  })
  location!: ToastLocation;

  @Column({ allowNull: true })
  customLocation?: string;

  @HasMany(() => Invite)
  invites!: Invite[];

  @HasOne(() => Accusation)
  accusation?: Accusation | null;
}
