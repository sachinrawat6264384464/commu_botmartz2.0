import { test, expect } from '@playwright/test';

test.describe('Botmartz Arena Multi-Tier Enrollment Rules API Test Suite', () => {
  const BASE_URL = 'http://localhost:3001';
  const testEmail = `qa_multitier_${Date.now()}@test.com`;

  test('Enforce 2 Baby Step Max & Cross-Tier Enrollment Restrictions', async ({ request }) => {
    // 1. Enroll in 1st Baby Step project (b1) -> Should succeed
    const res1 = await request.post(`${BASE_URL}/api/arena/enroll`, {
      data: {
        name: 'QA Builder Multi',
        email: testEmail,
        projectId: 'b1',
        projectTitle: 'CLI Markdown Document Parser',
        difficulty: 'Baby Step',
        whatsapp: '9876543210',
        dpdpConsent: true,
      },
    });
    expect([200, 201]).toContain(res1.status());
    const body1 = await res1.json();
    expect(body1.success).toBe(true);

    // 2. Enroll in 2nd Baby Step project (b2) -> Should succeed
    const res2 = await request.post(`${BASE_URL}/api/arena/enroll`, {
      data: {
        name: 'QA Builder Multi',
        email: testEmail,
        projectId: 'b2',
        projectTitle: 'FastAPI Schema Sanitizer',
        difficulty: 'Baby Step',
        whatsapp: '9876543210',
        dpdpConsent: true,
      },
    });
    expect([200, 201]).toContain(res2.status());
    const body2 = await res2.json();
    expect(body2.success).toBe(true);

    // 3. Attempt 3rd Baby Step project (b3) -> Should fail with 400 (Limit 2 reached)
    const res3 = await request.post(`${BASE_URL}/api/arena/enroll`, {
      data: {
        name: 'QA Builder Multi',
        email: testEmail,
        projectId: 'b3',
        projectTitle: 'LLM Prompt Cache Wrapper',
        difficulty: 'Baby Step',
        whatsapp: '9876543210',
        dpdpConsent: true,
      },
    });
    expect(res3.status()).toBe(400);
    const body3 = await res3.json();
    expect(body3.success).toBe(false);
    expect(body3.error).toContain('Baby Step Limit Reached');

    // 4. Attempt Non-Baby Step project (p1 - Hard) while active in Baby Step -> Should fail with 400
    const res4 = await request.post(`${BASE_URL}/api/arena/enroll`, {
      data: {
        name: 'QA Builder Multi',
        email: testEmail,
        projectId: 'p1',
        projectTitle: 'Multi-Spectral Satellite Imagery',
        difficulty: 'Hard',
        whatsapp: '9876543210',
        dpdpConsent: true,
      },
    });
    expect(res4.status()).toBe(400);
    const body4 = await res4.json();
    expect(body4.error).toContain('Tier Constraint');

    // 5. Unenroll from 1st Baby Step project (b1) -> Should succeed
    const resUnenroll = await request.post(`${BASE_URL}/api/arena/unenroll`, {
      data: {
        email: testEmail,
        projectId: 'b1',
      },
    });
    expect(resUnenroll.status()).toBe(200);
    const bodyUnenroll = await resUnenroll.json();
    expect(bodyUnenroll.success).toBe(true);

    // 6. Now student has only 1 active Baby Step project (b2).
    // Enroll in b3 (Baby Step) -> Should succeed now!
    const res6 = await request.post(`${BASE_URL}/api/arena/enroll`, {
      data: {
        name: 'QA Builder Multi',
        email: testEmail,
        projectId: 'b3',
        projectTitle: 'LLM Prompt Cache Wrapper',
        difficulty: 'Baby Step',
        whatsapp: '9876543210',
        dpdpConsent: true,
      },
    });
    expect([200, 201]).toContain(res6.status());
    const body6 = await res6.json();
    expect(body6.success).toBe(true);
  });
});
