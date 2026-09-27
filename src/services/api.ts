export const adminLogin = async (credentials: any): Promise<{ token: string; admin: AdminUser }> => {
  const email = String(credentials?.email || '').trim().toLowerCase();
  const password = String(credentials?.password || '').trim();

  // 1. क्लाइंट-साइड डायरेक्ट मास्टर लॉगिन (Vercel पर बिना बैकएंड के तुरंत लॉगिन कराएगा)
  if (
    (email === 'admin@rishabhsen.com' || email === 'contact@cinematicrishabh.site') &&
    (password === 'Rishabh@2026' || password === 'Admin@123' || password === 'admin123')
  ) {
    const demoToken = 'rishabh_master_jwt_token_' + Date.now();
    setAdminToken(demoToken);
    return {
      token: demoToken,
      admin: {
        id: '1',
        email: email,
        name: 'Rishabh Sen',
        role: 'superadmin'
      }
    };
  }

  // 2. बैकएंड कॉल (लोकल डेवलपमेंट के लिए)
  try {
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    
    const contentType = res.headers.get('content-type');
    if (res.ok && contentType && contentType.includes('application/json')) {
      const data = await res.json();
      if (data.token) setAdminToken(data.token);
      return data;
    }
  } catch (e) {
    console.warn("Backend unavailable, checking fallback credentials");
  }

  // अगर क्रेडेंशियल्स गलत हैं
  throw new Error('Authentication failed. Please verify credentials.');
};
