import { test, expect, type APIRequestContext } from '@playwright/test';
import { env } from '../../src/utils/env';

interface BookingPayload {
  firstname: string;
  lastname: string;
  totalprice: number;
  depositpaid: boolean;
  bookingdates: { checkin: string; checkout: string };
  additionalneeds?: string;
}

const newBooking = (): BookingPayload => ({
  firstname: 'Jane',
  lastname: 'Doe',
  totalprice: 250,
  depositpaid: true,
  bookingdates: { checkin: '2026-12-01', checkout: '2026-12-05' },
  additionalneeds: 'Breakfast',
});

async function getAuthToken(request: APIRequestContext): Promise<string> {
  const response = await request.post('/auth', {
    data: { username: env.apiUsername, password: env.apiPassword },
  });
  expect(response.ok()).toBeTruthy();
  const { token } = await response.json();
  return token;
}

test.describe('Booking API', () => {
  test('GET /booking returns a list of bookings @smoke', async ({ request }) => {
    const response = await request.get('/booking');

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(Array.isArray(body)).toBe(true);
    expect(body[0]).toHaveProperty('bookingid');
  });

  test('booking lifecycle: create, read, update, delete @regression', async ({ request }) => {
    const token = await getAuthToken(request);
    const payload = newBooking();

    // Create
    const createResponse = await request.post('/booking', { data: payload });
    expect(createResponse.status()).toBe(200);
    const created = await createResponse.json();
    expect(created.booking).toMatchObject(payload);
    const bookingId: number = created.bookingid;

    // Read
    const getResponse = await request.get(`/booking/${bookingId}`);
    expect(getResponse.status()).toBe(200);
    expect(await getResponse.json()).toMatchObject(payload);

    // Update
    const updated = { ...payload, firstname: 'Janet', totalprice: 300 };
    const putResponse = await request.put(`/booking/${bookingId}`, {
      data: updated,
      headers: { Cookie: `token=${token}` },
    });
    expect(putResponse.status()).toBe(200);
    expect(await putResponse.json()).toMatchObject({ firstname: 'Janet', totalprice: 300 });

    // Delete
    const deleteResponse = await request.delete(`/booking/${bookingId}`, {
      headers: { Cookie: `token=${token}` },
    });
    expect(deleteResponse.status()).toBe(201);

    // Verify deletion
    const afterDelete = await request.get(`/booking/${bookingId}`);
    expect(afterDelete.status()).toBe(404);
  });

  test('delete without a token is forbidden @regression', async ({ request }) => {
    const createResponse = await request.post('/booking', { data: newBooking() });
    const { bookingid } = await createResponse.json();

    const response = await request.delete(`/booking/${bookingid}`);

    expect(response.status()).toBe(403);
  });
});
