import { test, expect } from '@playwright/test';

test.describe('Botmartz Automated API Test Suite', () => {

  const BASE_URL = 'http://localhost:3001';

  // 1. Direct Registration API (/api/admin/direct-register)
  test('POST /api/admin/direct-register - Valid Student Registration', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/api/admin/direct-register`, {
      data: {
        name: 'QA Test Builder',
        email: `qa_builder_${Date.now()}@test.com`,
        phone: '9876543210',
        organization: 'IET DAVV Automated Test Org',
        plan: 'bundle',
        githubUsername: 'qa-test-github'
      }
    });

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.success).toBe(true);
    expect(body.registration).toBeDefined();
    expect(body.registration.checkInCode).toMatch(/^ADM-[A-Z0-9]{8}$/);
    expect(body.registration.amount).toBe(299);
    expect(body.registration.status).toBe('paid');
  });

  test('POST /api/admin/direct-register - Missing Name Error Handling', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/api/admin/direct-register`, {
      data: {
        email: 'invalid_no_name@test.com',
        plan: 'bundle'
      }
    });

    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.success).toBe(false);
    expect(body.error).toContain('Name and email are required');
  });

  test('POST /api/admin/direct-register - Invalid Payload Malformed Data', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/api/admin/direct-register`, {
      data: {}
    });

    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.success).toBe(false);
  });

  // 2. Checkout Verification API (/api/checkout/verify)
  test('POST /api/checkout/verify - Missing Order ID Returns 400', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/api/checkout/verify`, {
      data: {
        razorpay_payment_id: 'pay_test12345'
      }
    });

    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.success).toBe(false);
  });

  // 3. Arena Enrollment API (/api/arena/enroll)
  test('POST /api/arena/enroll - Valid Track Enrollment', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/api/arena/enroll`, {
      data: {
        name: 'QA Student',
        email: `qa_enroll_${Date.now()}@test.com`,
        projectId: 'track-01',
        projectTitle: 'AI System Blueprint',
        whatsapp: '9876543210',
        dpdpConsent: true
      }
    });

    expect([200, 201]).toContain(response.status());
    const body = await response.json();
    expect(body.success).toBe(true);
  });

  // 4. Admin Security & Authentication Checks
  test('GET /api/admin/security - Unauthenticated Access Handled Safely', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/admin/security`);
    // Should return 401/403 or safe JSON without exposing private keys
    expect([200, 401, 403]).toContain(response.status());
    const body = await response.json();
    expect(JSON.stringify(body)).not.toContain('FIREBASE_ADMIN_PRIVATE_KEY');
    expect(JSON.stringify(body)).not.toContain('RAZORPAY_KEY_SECRET');
  });

  // 5. 404 Endpoint Handling
  test('GET /api/nonexistent-route - 404 Handling', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/nonexistent-route`);
    expect(response.status()).toBe(404);
  });

});
