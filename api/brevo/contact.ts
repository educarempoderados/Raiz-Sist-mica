import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, nome, whatsapp } = req.body;
    const apiKey = process.env.BREVO_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: "Brevo API Key not configured" });
    }

    const response = await fetch("https://api.brevo.com/v3/contacts", {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "api-key": apiKey
      },
      body: JSON.stringify({
        email,
        attributes: {
          NOME: nome,
          SMS: whatsapp ? ("55" + whatsapp.replace(/\D/g, '')) : undefined
        },
        updateEnabled: true
      })
    });
    
    let data;
    try {
      data = await response.json();
    } catch(e) {}

    if (!response.ok && response.status !== 400 && data?.code !== 'duplicate_parameter') {
      console.error("Brevo API Error:", data);
      return res.status(response.status).json({ error: "Brevo API Error", data });
    }

    res.json({ success: true, data });
  } catch (e: any) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
}
