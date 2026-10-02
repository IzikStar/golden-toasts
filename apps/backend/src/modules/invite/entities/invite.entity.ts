import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  PrimaryKey,
  BelongsTo,
} from 'sequelize-typescript';
import { User } from '../../user/entities/user.entity';
import { Toast } from '../../toast/entities/toast.entity';

@Table({
  tableName: 'invites',
  indexes: [
    {
      unique: true,
      fields: ['toastId', 'userId'],
    },
  ],
})
export class Invite extends Model<Partial<Invite>> {
  @PrimaryKey
  @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4 })
  id!: string;

  @ForeignKey(() => Toast)
  @Column({ type: DataType.UUID, allowNull: false })
  toastId!: string;

  @BelongsTo(() => Toast)
  toast!: Toast;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: false })
  userId!: string;

  @BelongsTo(() => User)
  invitee!: User;

  @Column({ type: DataType.BOOLEAN ,defaultValue: null, allowNull: true })
  isConfirmed!: boolean | null;
}
