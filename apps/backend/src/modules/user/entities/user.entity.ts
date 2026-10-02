import {
  Table,
  Column,
  Model,
  DataType,
  HasMany,
  PrimaryKey,
} from 'sequelize-typescript';
import { Toast } from '../../toast/entities/toast.entity';
import { Invite } from '../../invite/entities/invite.entity';
import { Accusation } from '../../accusation/entities/accusation.entity';
import { Exclude, Expose } from 'class-transformer';

@Table({ tableName: 'users' })
export class User extends Model<Partial<User>> {
  @Expose()
  @PrimaryKey
  @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4 })
  id!: string;

  @Expose()
  @Column({ unique: true, allowNull: false })
  username!: string;

  @Exclude()
  @Column({ allowNull: false })
  password!: string;

  @Expose()
  @Column({ defaultValue: false })
  isAdmin!: boolean;

  @Expose()
  @Column({ defaultValue: false })
  isPersonaNonGrata!: boolean;

  @Expose()
  @Column({ allowNull: true })
  description?: string;

  @HasMany(() => Toast)
  createdToasts!: Toast[];

  @HasMany(() => Invite)
  invites!: Invite[];

  @HasMany(() => Accusation, 'reporterId')
  accusationsMade!: Accusation[];

  @HasMany(() => Accusation, 'accusedUserId')
  accusationsReceived!: Accusation[];
}
