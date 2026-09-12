const http = require('http');

const BASE_URL = 'http://localhost:3001';

async function fetchUrl(path, options = {}) {
  const t0 = Date.now();
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const reqOptions = {
      method: options.method || 'GET',
      headers: options.headers || {},
    };

    const req = http.request(url, reqOptions, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        const duration = Date.now() - t0;
        try {
          const json = JSON.parse(body);
          resolve({ status: res.statusCode, duration, data: json });
        } catch (e) {
          resolve({ status: res.statusCode, duration, text: body });
        }
      });
    });

    req.on('error', (err) => reject(err));

    if (options.body) {
      req.write(typeof options.body === 'object' ? JSON.stringify(options.body) : options.body);
    }
    req.end();
  });
}

async function runFullSuiteTest() {
  console.log("=================================================");
  console.log("🚀 STARTING COMPLETE SUITE & INTEGRATION TEST");
  console.log("=================================================\n");

  const results = [];

  // 1. Admin Telemetry & Control Panel (/admin)
  try {
    const r = await fetchUrl('/admin');
    const valid = r.status === 200 || r.status === 307;
    results.push({ test: 'Admin Main Telemetry Page (/admin)', status: r.status, duration: `${r.duration}ms`, pass: valid });
  } catch (e) {
    results.push({ test: 'Admin Main Telemetry Page (/admin)', status: 'FAIL', duration: 'N/A', pass: false, error: e.message });
  }

  // 2. Bootcamp Admin API (/api/admin/bootcamps)
  try {
    const r = await fetchUrl('/api/admin/bootcamps');
    const valid = r.status === 200 && r.data.success && r.data.registrations.length === 50 && r.data.bootcamps.length === 3;
    results.push({
      test: 'Bootcamps API (/api/admin/bootcamps)',
      status: r.status,
      duration: `${r.duration}ms`,
      pass: valid,
      details: valid ? `50 Registrations, 3 Bootcamps, Rev: ₹${r.data.stats.totalRevenue}` : 'Invalid payload'
    });
  } catch (e) {
    results.push({ test: 'Bootcamps API (/api/admin/bootcamps)', status: 'FAIL', duration: 'N/A', pass: false, error: e.message });
  }

  // 3. Coupons API (/api/admin/coupons)
  try {
    const r = await fetchUrl('/api/admin/coupons');
    const valid = r.status === 200 && r.data.success && Array.isArray(r.data.coupons) && r.data.coupons.length > 0;
    results.push({
      test: 'Coupons API (/api/admin/coupons)',
      status: r.status,
      duration: `${r.duration}ms`,
      pass: valid,
      details: valid ? `${r.data.coupons.length} Coupons Total` : 'Invalid payload'
    });
  } catch (e) {
    results.push({ test: 'Coupons API (/api/admin/coupons)', status: 'FAIL', duration: 'N/A', pass: false, error: e.message });
  }

  // 4. Public Coupon Verification API - BOTMARTZ10 (10% OFF)
  try {
    const r = await fetchUrl('/api/events/verify-coupon', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: { code: 'BOTMARTZ10' }
    });
    const valid = r.status === 200 && r.data.success === true && r.data.discountValue === 10;
    results.push({
      test: 'Public Coupon Verify - BOTMARTZ10',
      status: r.status,
      duration: `${r.duration}ms`,
      pass: valid,
      details: valid ? `Code: ${r.data.code}, Discount: ${r.data.discountValue}%, Remaining: ${r.data.remainingUses}` : JSON.stringify(r.data)
    });
  } catch (e) {
    results.push({ test: 'Public Coupon Verify - BOTMARTZ10', status: 'FAIL', duration: 'N/A', pass: false, error: e.message });
  }

  // 5. Public Coupon Verification API - BMFREE6 (100% FREE PASS)
  try {
    const r = await fetchUrl('/api/events/verify-coupon', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: { code: 'BMFREE6' }
    });
    const valid = r.status === 200 && r.data.success === true && r.data.discountValue === 100;
    results.push({
      test: 'Public Coupon Verify - BMFREE6 (Free Pass)',
      status: r.status,
      duration: `${r.duration}ms`,
      pass: valid,
      details: valid ? `Code: ${r.data.code}, Discount: ${r.data.discountValue}%, Remaining: ${r.data.remainingUses}` : JSON.stringify(r.data)
    });
  } catch (e) {
    results.push({ test: 'Public Coupon Verify - BMFREE6', status: 'FAIL', duration: 'N/A', pass: false, error: e.message });
  }

  // 6. Public Coupon Verification API - Invalid Coupon Guard
  try {
    const r = await fetchUrl('/api/events/verify-coupon', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: { code: 'INVALID_TEST_CODE_99' }
    });
    const valid = r.status === 404 && r.data.success === false;
    results.push({
      test: 'Public Coupon Verify - Invalid Guard',
      status: r.status,
      duration: `${r.duration}ms`,
      pass: valid,
      details: valid ? `Correctly rejected invalid code: "${r.data.error}"` : JSON.stringify(r.data)
    });
  } catch (e) {
    results.push({ test: 'Public Coupon Verify - Invalid Guard', status: 'FAIL', duration: 'N/A', pass: false, error: e.message });
  }

  // 7. Event Feedback API (/api/admin/feedback)
  try {
    const r = await fetchUrl('/api/admin/feedback');
    const valid = r.status === 200 && r.data.success && Array.isArray(r.data.feedbacks) && r.data.feedbacks.length > 0;
    results.push({
      test: 'Event Feedback API (/api/admin/feedback)',
      status: r.status,
      duration: `${r.duration}ms`,
      pass: valid,
      details: valid ? `${r.data.feedbacks.length} Feedbacks, Avg Rating: ${r.data.stats.avgOverall}/5.0` : 'Invalid payload'
    });
  } catch (e) {
    results.push({ test: 'Event Feedback API (/api/admin/feedback)', status: 'FAIL', duration: 'N/A', pass: false, error: e.message });
  }

  // 8. Direct Registration API Validation Guard (/api/admin/direct-register)
  try {
    const r = await fetchUrl('/api/admin/direct-register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: { phone: '123' } // Missing name and email
    });
    const valid = r.status === 400 && r.data.success === false;
    results.push({
      test: 'Direct Register API Validation Guard',
      status: r.status,
      duration: `${r.duration}ms`,
      pass: valid,
      details: valid ? `Correctly rejected missing name/email` : JSON.stringify(r.data)
    });
  } catch (e) {
    results.push({ test: 'Direct Register API Validation Guard', status: 'FAIL', duration: 'N/A', pass: false, error: e.message });
  }

  // 9. Toggle Attendance API Validation Guard (/api/admin/toggle-attendance)
  try {
    const r = await fetchUrl('/api/admin/toggle-attendance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: {} // Missing registrationId
    });
    const valid = r.status === 400 && r.data.success === false;
    results.push({
      test: 'Toggle Attendance API Validation Guard',
      status: r.status,
      duration: `${r.duration}ms`,
      pass: valid,
      details: valid ? `Correctly rejected missing registrationId` : JSON.stringify(r.data)
    });
  } catch (e) {
    results.push({ test: 'Toggle Attendance API Validation Guard', status: 'FAIL', duration: 'N/A', pass: false, error: e.message });
  }

  // 10. Public Community Page (/community)
  try {
    const r = await fetchUrl('/community');
    results.push({ test: 'Public Community Page (/community)', status: r.status, duration: `${r.duration}ms`, pass: r.status === 200 });
  } catch (e) {
    results.push({ test: 'Public Community Page (/community)', status: 'FAIL', duration: 'N/A', pass: false, error: e.message });
  }

  // Print Summary Table
  console.log("----------------------------------------------------------------------------------");
  console.log("TEST NAME                                  | STATUS | TIME   | RESULT | DETAILS");
  console.log("----------------------------------------------------------------------------------");
  let passedCount = 0;
  results.forEach(res => {
    if (res.pass) passedCount++;
    const nameStr = res.test.padEnd(42, ' ');
    const statusStr = String(res.status).padEnd(6, ' ');
    const durStr = res.duration.padEnd(6, ' ');
    const passStr = res.pass ? '✅ PASS' : '❌ FAIL';
    const detailStr = res.details ? ` (${res.details})` : '';
    console.log(`${nameStr} | ${statusStr} | ${durStr} | ${passStr}${detailStr}`);
  });
  console.log("----------------------------------------------------------------------------------");
  console.log(`TOTAL SUITE STATUS: ${passedCount}/${results.length} PASSED (${Math.round((passedCount/results.length)*100)}% SUCCESS RATE)\n`);
}

runFullSuiteTest();
