import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  PrimaryKey,
  BelongsTo,
} from 'sequelize-typescript';
import { Op } from 'sequelize';
import { User } from '../../user/entities/user.entity';
import { Toast } from '../../toast/entities/toast.entity';

@Table({
  tableName: 'accusations',
  indexes: [
    {
      unique: true,
      fields: ['accusedUserId', 'reporterId', 'crimeToastId'],
      where: {
        crimeToastId: {
          [Op.ne]: null,
        },
      },
    },
  ],
  validate: {
    checkOneNonNull: function () {
      // `== null` also catches fields that were omitted (undefined), which
      // is how an accusation without either value reaches the model.
      if (this.crimeToastId == null && this.reason == null) {
        throw new Error(
          'Either crimeToast or reason must be provided, but not both null.'
        );
      }

      if (this.crimeToastId && this.reason) {
        throw new Error(
          'Only one of crimeToast or reason can be provided, the other must be null.'
        );
      }
    },
  },
})
export class Accusation extends Model<Partial<Accusation>> {
  @PrimaryKey
  @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4 })
  id!: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: false })
  accusedUserId!: string;

  @BelongsTo(() => User, { as: 'accusedUser', foreignKey: 'accusedUserId' })
  accusedUser!: User;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: false })
  reporterId!: string;

  @BelongsTo(() => User, { as: 'reporter', foreignKey: 'reporterId' })
  reporter!: User;
  
  @ForeignKey(() => Toast)
  @Column({ type: DataType.UUID, allowNull: true })
  crimeToastId?: string | null;
  
  @BelongsTo(() => Toast, { as: 'crimeToast', foreignKey: 'crimeToastId' })
  crimeToast?: Toast;

  @Column({ type: DataType.TEXT, allowNull: true })
  reason?: string | null;
}
