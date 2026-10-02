import { HttpStatus, INestApplication } from '@nestjs/common';
import { getConnectionToken } from '@nestjs/sequelize';
import { Test } from '@nestjs/testing';
import { Sequelize } from 'sequelize-typescript';
import request from 'supertest';
import { AppModule } from '../src/app/app.module';
import { configureApp } from '../src/app/configure-app';
import { ToastLocation } from '../src/modules/toast/entities/toast-location.enum';

type Session = { id: string; token: string };

const DAY_MS = 24 * 60 * 60 * 1000;

const decodeUserId = (token: string): string =>
  JSON.parse(Buffer.from(token.split('.')[1], 'base64url').toString()).id;

describe('GoldenToasts API (e2e)', () => {
  let app: INestApplication;
  let api: ReturnType<typeof request>;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    })
      .setLogger({
        log: () => undefined,
        error: () => undefined,
        warn: () => undefined,
      })
      .compile();

    app = configureApp(moduleRef.createNestApplication());
    await app.init();

    // Start every run from empty tables.
    await app.get<Sequelize>(getConnectionToken()).sync({ force: true });

    api = request(app.getHttpServer());
  });

  afterAll(async () => {
    await app?.close();
  });

  const signUp = async (username: string): Promise<Session> => {
    const res = await api
      .post('/api/users')
      .send({ username, password: 'Secret123' })
      .expect(HttpStatus.CREATED);

    return {
      id: decodeUserId(res.body.accessToken),
      token: res.body.accessToken,
    };
  };

  const as = (session: Session) => `Bearer ${session.token}`;

  let host: Session;
  let guest: Session;
  let toastId: string;
  let inviteId: string;

  it('signs up and logs in', async () => {
    host = await signUp('host');
    guest = await signUp('guest');

    const res = await api
      .post('/api/auth/login')
      .send({ username: 'host', password: 'Secret123' })
      .expect(HttpStatus.CREATED);
    expect(decodeUserId(res.body.accessToken)).toBe(host.id);

    await api
      .post('/api/auth/login')
      .send({ username: 'host', password: 'Wrong1234' })
      .expect(HttpStatus.UNAUTHORIZED);
  });

  it('rejects a weak password and a duplicate username', async () => {
    await api
      .post('/api/users')
      .send({ username: 'weakling', password: 'password' })
      .expect(HttpStatus.BAD_REQUEST);

    await api
      .post('/api/users')
      .send({ username: 'host', password: 'Secret123' })
      .expect(HttpStatus.CONFLICT);
  });

  it('requires a token on protected routes and never returns passwords', async () => {
    await api.get('/api/users').expect(HttpStatus.UNAUTHORIZED);

    const res = await api
      .get('/api/users')
      .set('Authorization', as(host))
      .expect(HttpStatus.OK);

    expect(res.body.map((u: { username: string }) => u.username)).toEqual([
      'guest',
      'host',
    ]);
    for (const user of res.body) {
      expect(user).not.toHaveProperty('password');
    }
  });

  it('keeps admin routes away from regular users', async () => {
    await api
      .get('/api/toasts')
      .set('Authorization', as(host))
      .expect(HttpStatus.FORBIDDEN);
  });

  it('creates a toast together with its invites', async () => {
    const res = await api
      .post('/api/toasts')
      .set('Authorization', as(host))
      .send({
        toast: {
          userId: host.id,
          title: 'Promotion',
          reason: 'Got promoted',
          dueDate: new Date(Date.now() + 7 * DAY_MS).toISOString(),
          foods: ['pizza'],
          drinks: ['beer'],
          location: ToastLocation.ON_BALCONY,
        },
        invites: [guest.id],
      })
      .expect(HttpStatus.CREATED);

    toastId = res.body.id;
    expect(res.body).toMatchObject({ userId: host.id, isDone: false });
  });

  it('lets the invitee accept, but not another user', async () => {
    const pending = await api
      .get(`/api/invites/receiver/${guest.id}/pending`)
      .set('Authorization', as(guest))
      .expect(HttpStatus.OK);

    expect(pending.body).toHaveLength(1);
    inviteId = pending.body[0].id;

    await api
      .put(`/api/invites/${inviteId}`)
      .set('Authorization', as(host))
      .send({ isConfirmed: true })
      .expect(HttpStatus.FORBIDDEN);

    const accepted = await api
      .put(`/api/invites/${inviteId}`)
      .set('Authorization', as(guest))
      .send({ isConfirmed: true })
      .expect(HttpStatus.OK);
    expect(accepted.body.isConfirmed).toBe(true);

    const stillPending = await api
      .get(`/api/invites/receiver/${guest.id}/pending`)
      .set('Authorization', as(guest))
      .expect(HttpStatus.OK);
    expect(stillPending.body).toHaveLength(0);
  });

  it("forbids editing someone else's toast", async () => {
    await api
      .put(`/api/toasts/${toastId}`)
      .set('Authorization', as(guest))
      .send({ title: 'Hijacked' })
      .expect(HttpStatus.FORBIDDEN);
  });

  it('puts accepted invites back to pending when the host moves the date', async () => {
    await api
      .put(`/api/toasts/${toastId}`)
      .set('Authorization', as(host))
      .send({ dueDate: new Date(Date.now() + 14 * DAY_MS).toISOString() })
      .expect(HttpStatus.OK);

    const pending = await api
      .get(`/api/invites/receiver/${guest.id}/pending`)
      .set('Authorization', as(guest))
      .expect(HttpStatus.OK);

    expect(pending.body).toHaveLength(1);
    expect(pending.body[0]).toMatchObject({ id: inviteId, isConfirmed: null });
  });
});
