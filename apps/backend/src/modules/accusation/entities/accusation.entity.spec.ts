import { Sequelize } from 'sequelize-typescript';
import { Accusation } from './accusation.entity';
import { User } from '../../user/entities/user.entity';
import { Toast } from '../../toast/entities/toast.entity';
import { Invite } from '../../invite/entities/invite.entity';

/**
 * Exercises the model-level "exactly one of reason / crimeToastId" validator.
 * `build()` + `validate()` run Sequelize's validation without a connection.
 */
describe('Accusation model validation', () => {
  let sequelize: Sequelize;

  beforeAll(() => {
    sequelize = new Sequelize({ dialect: 'postgres', logging: false });
    sequelize.addModels([User, Toast, Invite, Accusation]);
  });

  afterAll(() => sequelize.close());

  const parties = {
    reporterId: '7f8a1b52-2d3e-4c1a-9b6f-0a1b2c3d4e5f',
    accusedUserId: '3c4d5e6f-7a8b-4c9d-8e0f-1a2b3c4d5e6f',
  };
  const crimeToastId = '9e8d7c6b-5a4f-4e3d-9c2b-1a0f9e8d7c6b';

  const validate = (fields: Partial<Accusation>) =>
    Accusation.build({ ...parties, ...fields }).validate();

  it('accepts an accusation with only a reason', async () => {
    await expect(
      validate({ reason: 'Skipped the toast' })
    ).resolves.toBeDefined();
  });

  it('accepts an accusation linked only to a toast', async () => {
    await expect(validate({ crimeToastId })).resolves.toBeDefined();
  });

  it('rejects an accusation with both a reason and a toast', async () => {
    await expect(
      validate({ reason: 'Skipped the toast', crimeToastId })
    ).rejects.toThrow('Only one of crimeToast or reason can be provided');
  });

  it('rejects an accusation with both explicitly null', async () => {
    await expect(
      validate({ reason: null, crimeToastId: null })
    ).rejects.toThrow('Either crimeToast or reason must be provided');
  });

  it('rejects an accusation where both were omitted', async () => {
    await expect(validate({})).rejects.toThrow(
      'Either crimeToast or reason must be provided'
    );
  });
});
