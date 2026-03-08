const fetch = require('node-fetch');

const API_URL = 'http://localhost:7000'; // Make sure backend is running on port 7000

async function runTests() {
  console.log('--- Starting JWT Middleware Tests ---');
  let passed = 0;
  let failed = 0;

  const assert = (condition, message) => {
    if (condition) {
      console.log(`✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${message}`);
      failed++;
    }
  };

  // 1. Test accessing protected route without a token
  try {
    const res1 = await fetch(`${API_URL}/profile`, { method: 'GET' });
    assert(res1.status === 401, `Access without token should return 401 (Got ${res1.status})`);
  } catch (err) {
    console.error('Error in Test 1:', err);
    failed++;
  }

  // 2. Test accessing protected route with an invalid token
  try {
    const res2 = await fetch(`${API_URL}/profile`, {
      method: 'GET',
      headers: { 'Authorization': 'Bearer invalid_random_token_string' }
    });
    assert(res2.status === 401 || res2.status === 403, `Access with invalid token should return 401 or 403 (Got ${res2.status})`);
  } catch (err) {
    console.error('Error in Test 2:', err);
    failed++;
  }

  // 3. Test logging in to get a valid token, then accessing the protected route
  try {
    // Generate a random user to register and login
    const randomNum = Math.floor(Math.random() * 1000000);
    const testUser = {
      fullName: `Test User ${randomNum}`,
      email: `test${randomNum}@example.com`,
      password: 'password123'
    };

    // Register
    await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testUser)
    });

    // Login
    const loginRes = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testUser.email, password: testUser.password })
    });

    if (loginRes.ok) {
      const loginData = await loginRes.json();
      const validToken = loginData.token;

      // Access protected route
      const profileRes = await fetch(`${API_URL}/profile`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${validToken}` }
      });
      assert(profileRes.status === 200, `Access with valid token should return 200 (Got ${profileRes.status})`);
    } else {
      console.error('❌ FAIL: Failed to login test user to get a valid token');
      failed++;
    }
  } catch (err) {
    console.error('Error in Test 3:', err);
    failed++;
  }

  console.log('-------------------------------------');
  console.log(`Results: ${passed} passed, ${failed} failed`);
  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
