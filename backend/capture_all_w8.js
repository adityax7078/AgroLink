const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const artifactDir = 'C:\\Users\\adity\\.gemini\\antigravity-ide\\brain\\e4b07f30-075f-4921-80d3-5c845ca3ff67';

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

(async () => {
  console.log('Launching Edge Browser...');
  const browser = await puppeteer.launch({
    executablePath: edgePath,
    headless: true,
    defaultViewport: { width: 1440, height: 900 }
  });

  const page = await browser.newPage();

  const takeScreenshot = async (name) => {
    const filePath = path.join(artifactDir, name);
    await page.screenshot({ path: filePath });
    console.log(`Saved screenshot: ${name}`);
  };

  try {
    // 1. Landing Page
    console.log('1. Navigating to Landing Page...');
    await page.goto('http://localhost:5173/', { waitUntil: 'networkidle2' });
    await sleep(2000);
    await takeScreenshot('01_landing_page.png');

    // 2. Login Page
    console.log('2. Navigating to Login Page...');
    await page.goto('http://localhost:5173/login', { waitUntil: 'networkidle2' });
    await sleep(1500);
    await takeScreenshot('02_login_page.png');

    // 3. Farmer Login
    console.log('3. Logging in as farmer@agrolink.com...');
    await page.click('input[type="email"]');
    await page.type('input[type="email"]', 'farmer@agrolink.com');
    await page.click('input[placeholder="••••••••"]');
    await page.type('input[placeholder="••••••••"]', 'farmer123');
    await page.click('#authenticate-btn');
    await sleep(3000);
    await takeScreenshot('03_farmer_dashboard.png');

    // Scroll to form area
    await page.evaluate(() => window.scrollTo(0, 200));
    await sleep(500);

    // 4. Get AI Valuation suggested price
    console.log('4. Triggering AI valuation suggested price...');
    await page.click('input[placeholder="e.g. 100"]');
    await page.keyboard.down('Control');
    await page.keyboard.press('KeyA');
    await page.keyboard.up('Control');
    await page.keyboard.press('Backspace');
    await page.type('input[placeholder="e.g. 100"]', '120');

    let buttons = await page.$$('button');
    let aiSuggestBtn;
    for (const btn of buttons) {
      const text = await page.evaluate(el => el.textContent, btn);
      if (text.includes('Get AI Suggested Price')) {
        aiSuggestBtn = btn;
        break;
      }
    }

    if (aiSuggestBtn) {
      await aiSuggestBtn.click();
      await sleep(2500);
      await takeScreenshot('04_ai_pricing_modal.png');
      
      const modalButtons = await page.$$('button');
      let usePriceBtn;
      for (const btn of modalButtons) {
        const text = await page.evaluate(el => el.textContent, btn);
        if (text.includes('Use Recommended Price')) {
          usePriceBtn = btn;
          break;
        }
      }
      if (usePriceBtn) {
        await usePriceBtn.click();
        await sleep(1500);
      }
    }

    // Scroll to lower form area
    await page.evaluate(() => window.scrollTo(0, 450));
    await sleep(500);

    // 5. Create Harvest Listing
    console.log('5. Creating new listing...');
    await page.click('input[placeholder="Enter Price per unit"]');
    await page.keyboard.down('Control');
    await page.keyboard.press('KeyA');
    await page.keyboard.up('Control');
    await page.keyboard.press('Backspace');
    await page.type('input[placeholder="Enter Price per unit"]', '2450');

    await page.click('input[placeholder="City, State"]');
    await page.type('input[placeholder="City, State"]', 'Bhatinda, Punjab');
    
    const publishBtnList = await page.$$('button');
    let publishBtn;
    for (const btn of publishBtnList) {
      const text = await page.evaluate(el => el.textContent, btn);
      if (text.includes('Publish Listing')) {
        publishBtn = btn;
        break;
      }
    }
    if (publishBtn) {
      await publishBtn.click();
      await sleep(2500);
      await page.evaluate(() => window.scrollTo(0, 900));
      await sleep(1000);
      await takeScreenshot('05_listing_created.png');
    }

    // 6. Edit Listing
    console.log('6. Editing listing...');
    let editBtns = await page.$$('button');
    let editBtn;
    for (const btn of editBtns) {
      const text = await page.evaluate(el => el.textContent, btn);
      if (text.includes('Edit')) {
        editBtn = btn;
        break;
      }
    }
    if (editBtn) {
      await editBtn.click();
      await sleep(1500);
      
      const modalInputs = await page.$$('div[role="dialog"] input[type="number"]');
      if (modalInputs.length > 0) {
        await modalInputs[0].click();
        await page.keyboard.down('Control');
        await page.keyboard.press('KeyA');
        await page.keyboard.up('Control');
        await page.keyboard.press('Backspace');
        await modalInputs[0].type('150');
      }

      const saveBtn = await page.$('div[role="dialog"] button[type="submit"]');
      if (saveBtn) {
        await saveBtn.click();
        await sleep(2000);
        await takeScreenshot('06_listing_edited.png');
      }
    }

    // 7. Delete Modal Trigger
    console.log('7. Triggering delete modal...');
    let deleteBtns = await page.$$('button');
    let deleteBtn;
    for (const btn of deleteBtns) {
      const text = await page.evaluate(el => el.textContent, btn);
      if (text.includes('Delete')) {
        deleteBtn = btn;
        break;
      }
    }
    if (deleteBtn) {
      await deleteBtn.click();
      await sleep(1500);
      await takeScreenshot('07_delete_confirmation_modal.png');
      
      // Confirm deletion
      const modalButtons = await page.$$('div[role="dialog"] button');
      let confirmDeleteBtn;
      for (const btn of modalButtons) {
        const text = await page.evaluate(el => el.textContent, btn);
        if (text.includes('Confirm Deletion')) {
          confirmDeleteBtn = btn;
          break;
        }
      }
      if (confirmDeleteBtn) {
        await confirmDeleteBtn.click();
        await sleep(2500);
        await takeScreenshot('07b_listing_deleted.png');
      }
    }

    // 8. AI Advisor Page & Loading/Result States
    console.log('8. Navigating to AI Advisor page...');
    await page.goto('http://localhost:5173/ai-advisor', { waitUntil: 'networkidle2' });
    await sleep(2000);
    
    // Fill AI query form
    await page.click('input[placeholder="e.g. Mango"]');
    await page.keyboard.down('Control');
    await page.keyboard.press('KeyA');
    await page.keyboard.up('Control');
    await page.keyboard.press('Backspace');
    await page.type('input[placeholder="e.g. Mango"]', 'Sugarcane');

    await page.click('input[placeholder="e.g. Nashik, Maharashtra"]');
    await page.keyboard.down('Control');
    await page.keyboard.press('KeyA');
    await page.keyboard.up('Control');
    await page.keyboard.press('Backspace');
    await page.type('input[placeholder="e.g. Nashik, Maharashtra"]', 'Kolhapur, Maharashtra');

    await page.click('textarea[placeholder="Should I process my mangoes to pickle or sell them raw at local mandi?"]');
    await page.keyboard.down('Control');
    await page.keyboard.press('KeyA');
    await page.keyboard.up('Control');
    await page.keyboard.press('Backspace');
    await page.type('textarea[placeholder="Should I process my mangoes to pickle or sell them raw at local mandi?"]', 'What are value-addition paths for high-sucrose Sugarcane in Kolhapur?');
    await takeScreenshot('08_ai_advisor_page.png');

    const consultBtns = await page.$$('button');
    let consultBtn;
    for (const btn of consultBtns) {
      const text = await page.evaluate(el => el.textContent, btn);
      if (text.includes('Consult AgroLink AI Advisor')) {
        consultBtn = btn;
        break;
      }
    }
    if (consultBtn) {
      await consultBtn.click();
      await sleep(400); // Wait short duration to capture the loading state spinner
      await takeScreenshot('08b_ai_advisor_loading.png');
      
      await sleep(5500); // Wait for output streaming to complete
      await takeScreenshot('09_ai_advisor_result.png');
    }

    // 9. Empty State Check (via dynamic register)
    console.log('9. Generating empty state via new registration...');
    await page.evaluate(() => localStorage.removeItem('user'));
    await page.goto('http://localhost:5173/login', { waitUntil: 'networkidle2' });
    await sleep(1500);

    // Switch to Register Mode
    const registerTabs = await page.$$('button');
    for (const btn of registerTabs) {
      const text = await page.evaluate(el => el.textContent, btn);
      if (text.includes('Sign Up')) {
        await btn.click();
        break;
      }
    }
    await sleep(500);

    const randomNum = Math.floor(10000 + Math.random() * 90000);
    const emptyEmail = `farmer_${randomNum}@agrolink.com`;
    await page.click('input[type="email"]');
    await page.type('input[type="email"]', emptyEmail);
    
    // Type password
    const passwordInputs = await page.$$('input[type="password"]');
    if (passwordInputs.length >= 2) {
      await passwordInputs[0].click();
      await page.type('input[placeholder="••••••••"]', 'testpassword');
      await passwordInputs[1].click();
      await passwordInputs[1].type('testpassword');
    } else {
      await page.click('input[placeholder="••••••••"]');
      await page.type('input[placeholder="••••••••"]', 'testpassword');
    }

    // Click submit register
    const submitBtnList = await page.$$('button');
    for (const btn of submitBtnList) {
      const text = await page.evaluate(el => el.textContent, btn);
      if (text.includes('Create Account')) {
        await btn.click();
        break;
      }
    }
    await sleep(3000); // wait for register and auto redirect to login

    // Fill login for newly registered empty farmer
    await page.click('input[type="email"]');
    await page.keyboard.down('Control');
    await page.keyboard.press('KeyA');
    await page.keyboard.up('Control');
    await page.keyboard.press('Backspace');
    await page.type('input[type="email"]', emptyEmail);

    await page.click('input[placeholder="••••••••"]');
    await page.keyboard.down('Control');
    await page.keyboard.press('KeyA');
    await page.keyboard.up('Control');
    await page.keyboard.press('Backspace');
    await page.type('input[placeholder="••••••••"]', 'testpassword');

    await page.click('#authenticate-btn');
    await sleep(3000);
    
    // Take Empty State screenshot
    await page.evaluate(() => window.scrollTo(0, 900));
    await sleep(1000);
    await takeScreenshot('13_empty_state.png');

    // 10. Processor Logging and order placement
    console.log('10. Logging out empty farmer...');
    await page.evaluate(() => localStorage.removeItem('user'));
    await page.goto('http://localhost:5173/login', { waitUntil: 'networkidle2' });
    await sleep(1500);

    console.log('11. Logging in as processor...');
    const roleBtns = await page.$$('button');
    for (const btn of roleBtns) {
      const text = await page.evaluate(el => el.textContent, btn);
      if (text.includes('I am a Processor')) {
        await btn.click();
        break;
      }
    }
    await sleep(500);

    await page.click('input[type="email"]');
    await page.keyboard.down('Control');
    await page.keyboard.press('KeyA');
    await page.keyboard.up('Control');
    await page.keyboard.press('Backspace');
    await page.type('input[type="email"]', 'processor@agrolink.com');

    await page.click('input[placeholder="••••••••"]');
    await page.keyboard.down('Control');
    await page.keyboard.press('KeyA');
    await page.keyboard.up('Control');
    await page.keyboard.press('Backspace');
    await page.type('input[placeholder="••••••••"]', 'processor123');

    await page.click('#authenticate-btn');
    await sleep(3000);
    await takeScreenshot('10_processor_dashboard.png');

    // Scroll to procurement harvests area
    await page.evaluate(() => window.scrollTo(0, 500));
    await sleep(1000);

    const procureBtns = await page.$$('button');
    let procureBtn;
    for (const btn of procureBtns) {
      const text = await page.evaluate(el => el.textContent, btn);
      if (text.includes('Place Procurement Order Offer')) {
        procureBtn = btn;
        break;
      }
    }
    if (procureBtn) {
      await procureBtn.click();
      await sleep(2500);
      await takeScreenshot('11_order_placed.png');
    }

    // 11. Mobile check
    console.log('12. Mobile Responsive screen capture...');
    await page.setViewport({ width: 375, height: 820 });
    await page.goto('http://localhost:5173/dashboard', { waitUntil: 'networkidle2' });
    await sleep(2500);
    await takeScreenshot('12_mobile_dashboard.png');

    // 12. DevTools Network Monitor targeted screenshot
    console.log('13. Capturing DevTools Network monitor element...');
    await page.setViewport({ width: 1440, height: 900 });
    await page.goto('http://localhost:5173/dashboard', { waitUntil: 'networkidle2' });
    await sleep(2000);
    
    // Select element and capture
    const devtoolsPanel = await page.$('#devtools-network-monitor');
    if (devtoolsPanel) {
      await devtoolsPanel.screenshot({ path: path.join(artifactDir, '14_network_tab.png') });
      console.log('Saved screenshot: 14_network_tab.png');
    } else {
      console.log('Warning: #devtools-network-monitor element not found.');
    }

  } catch (err) {
    console.error('An error occurred during Puppeteer capture:', err);
  } finally {
    console.log('Closing Edge Browser...');
    await browser.close();
    console.log('Automation capture complete!');
  }
})();
