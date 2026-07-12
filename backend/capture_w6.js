const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

async function captureAuthFlow() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const baseUrl = 'http://localhost:5173';
  const testEmail = `farmer.w6.${Date.now()}@agrolink.com`;
  
  console.log('Launching browser...');
  const browser = await puppeteer.launch({
    executablePath: edgePath,
    headless: true,
    defaultViewport: { width: 1440, height: 1000 }
  });
  const page = await browser.newPage();
  
  // Log browser console messages for debugging
  page.on('console', msg => console.log('[BROWSER CONSOLE]', msg.text()));
  
  try {
    // Clean up any old localStorage
    await page.goto(baseUrl);
    await page.evaluate(() => localStorage.clear());

    // ==========================================
    // STEP 1: Registration Form & Success Response
    // ==========================================
    console.log('--- STEP 1: Registering User ---');
    await page.goto(`${baseUrl}/login`, { waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 1000));

    // Click on Sign Up toggle
    console.log('Switching to Sign Up mode...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const signUpBtn = buttons.find(b => b.textContent.includes('Sign Up'));
      if (signUpBtn) signUpBtn.click();
    });
    await new Promise(r => setTimeout(r, 500));

    // Fill registration form
    console.log(`Filling registration details for email: ${testEmail}...`);
    await page.type('input[placeholder="e.g. name@domain.com"]', testEmail);
    
    const passwordInputs = await page.$$('input[type="password"]');
    if (passwordInputs.length >= 2) {
      await passwordInputs[0].type('farmer123');
      await passwordInputs[1].type('farmer123');
    }

    // Take screenshot of the filled form
    await page.screenshot({ path: 'w6_register_form.png' });
    console.log('Saved w6_register_form.png');

    // Listen to network responses to verify register status
    page.on('response', async response => {
      if (response.url().includes('/api/auth/register')) {
        console.log(`[API Network Log] POST /api/auth/register status: ${response.status()}`);
        try {
          const body = await response.json();
          console.log(`[API Network Log] POST /api/auth/register response body:`, JSON.stringify(body));
        } catch (e) {
          console.log('[API Network Log] Failed to parse register response JSON');
        }
      }
    });

    // Submit form
    console.log('Submitting registration form...');
    await page.click('button[type="submit"]');
    
    // Wait for registration to complete and redirect back to login (where authenticate-btn appears)
    console.log('Waiting for registration to complete...');
    await page.waitForSelector('button[id="authenticate-btn"]', { timeout: 10000 });

    // Take screenshot of register success response
    await page.screenshot({ path: 'w6_register_success.png' });
    console.log('Saved w6_register_success.png');

    // ==========================================
    // STEP 2: Login Form & Success (Display JWT)
    // ==========================================
    console.log('--- STEP 2: Logging in ---');
    await new Promise(r => setTimeout(r, 500));

    // Clear email field and fill details
    console.log('Clearing email input via DOM...');
    await page.$eval('input[placeholder="e.g. name@domain.com"]', el => el.value = '');
    await page.type('input[placeholder="e.g. name@domain.com"]', testEmail);
    
    // Clear password field just in case and fill details
    await page.evaluate(() => {
      const pInput = document.querySelector('input[type="password"]');
      if (pInput) pInput.value = '';
    });
    
    const loginPasswordInputs = await page.$$('input[type="password"]');
    if (loginPasswordInputs.length >= 1) {
      await loginPasswordInputs[0].type('farmer123');
    }

    // Take screenshot of Login Form
    await page.screenshot({ path: 'w6_login_form.png' });
    console.log('Saved w6_login_form.png');

    // Listen to network responses to verify and grab JWT token
    let tokenFound = '';
    page.on('response', async response => {
      if (response.url().includes('/api/auth/login')) {
        console.log(`[API Network Log] POST /api/auth/login status: ${response.status()}`);
        try {
          const body = await response.json();
          console.log(`[API Network Log] POST /api/auth/login response body:`, JSON.stringify(body));
          if (body.token) {
            tokenFound = body.token;
          }
        } catch (e) {
          console.log('[API Network Log] Failed to parse login response JSON');
        }
      }
    });

    console.log('Submitting login form...');
    await page.click('button[id="authenticate-btn"]');
    
    // Wait for the login to succeed and navigate to dashboard
    await page.waitForSelector('h1', { timeout: 10000 }); // Waits for header to appear on dashboard
    await new Promise(r => setTimeout(r, 1000));

    // Take screenshot showing dashboard logged-in state (JWT validated)
    await page.screenshot({ path: 'w6_login_success.png' });
    console.log('Saved w6_login_success.png');

    // ==========================================
    // STEP 3: Protected Route Guard Redirect
    // ==========================================
    console.log('--- STEP 3: Testing Unauthorized Access Guard ---');
    // Clear localStorage to simulate unauthenticated user
    await page.evaluate(() => localStorage.clear());
    await new Promise(r => setTimeout(r, 500));

    // Try to visit /dashboard
    console.log('Navigating directly to /dashboard...');
    await page.goto(`${baseUrl}/dashboard`, { waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 2000));

    // Take screenshot showing we are redirected back to /login
    await page.screenshot({ path: 'w6_unauthorized_redirect.png' });
    console.log('Saved w6_unauthorized_redirect.png');

    // ==========================================
    // STEP 4: Rate Limiting Error (429 Response)
    // ==========================================
    console.log('--- STEP 4: Hitting Rate Limiter ---');
    console.log('Sending rapid authentication requests to trigger 429...');
    
    // Wait for the login form to be visible again
    await page.waitForSelector('input[placeholder="e.g. name@domain.com"]', { timeout: 10000 });
    
    // Fill credentials so the request structure is valid
    await page.type('input[placeholder="e.g. name@domain.com"]', testEmail);
    const ratePasswordInputs = await page.$$('input[type="password"]');
    if (ratePasswordInputs.length >= 1) {
      await ratePasswordInputs[0].type('wrongpassword');
    }

    // Click login button 6 times rapidly
    await page.waitForSelector('button[id="authenticate-btn"]', { timeout: 10000 });
    for (let i = 0; i < 6; i++) {
      console.log(`Clicking authentication button (${i + 1}/6)...`);
      await page.click('button[id="authenticate-btn"]');
      await new Promise(r => setTimeout(r, 200));
    }
    
    // Wait for rate limit toast message to appear
    await new Promise(r => setTimeout(r, 2000));
    await page.screenshot({ path: 'w6_rate_limit_error.png' });
    console.log('Saved w6_rate_limit_error.png');

    // ==========================================
    // STEP 5: OAuth Consent Screen & Redirection
    // ==========================================
    console.log('--- STEP 5: OAuth Flow (Simulated) ---');
    // Refresh page to clear error states and inputs
    await page.goto(`${baseUrl}/login`, { waitUntil: 'networkidle2' });
    await page.waitForSelector('a[id="oauth-google-btn"]', { timeout: 10000 });
    await new Promise(r => setTimeout(r, 1000));

    // Click on Sign in with Google
    console.log('Clicking "Sign in with Google"...');
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle2' }),
      page.click('a[id="oauth-google-btn"]')
    ]);
    
    // Wait for simulated OAuth consent page
    await page.waitForSelector('button[id="mock-authorize-btn"]', { timeout: 10000 });
    await page.screenshot({ path: 'w6_oauth_consent.png' });
    console.log('Saved w6_oauth_consent.png');

    // Submit Simulated Consent Form
    console.log('Authorizing AgroLink app...');
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle2' }),
      page.click('button[id="mock-authorize-btn"]')
    ]);
    
    // Now we should land back on the Dashboard page in logged-in state
    await page.waitForSelector('h1', { timeout: 10000 });
    await new Promise(r => setTimeout(r, 1500));
    await page.screenshot({ path: 'w6_oauth_success.png' });
    console.log('Saved w6_oauth_success.png');

  } catch (error) {
    console.error('An automation error occurred:', error);
    try {
      await page.screenshot({ path: 'w6_error_state.png' });
      console.log('Saved w6_error_state.png on failure.');
    } catch (e) {
      console.error('Failed to take failure screenshot:', e);
    }
  } finally {
    console.log('Closing browser...');
    await browser.close();
    console.log('Done!');
  }
}

captureAuthFlow();
