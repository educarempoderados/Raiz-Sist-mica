import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { contacts } = req.body;
    const apiKey = process.env.BREVO_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: "Brevo API Key not configured" });
    }

    const results = [];
    for (const contact of contacts) {
      const response = await fetch("https://api.brevo.com/v3/contacts", {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          "api-key": apiKey
        },
        body: JSON.stringify({
          email: contact.email,
          attributes: {
            NOME: contact.nome,
            SMS: contact.whatsapp ? ("55" + contact.whatsapp.replace(/\D/g, '')) : undefined
          },
          updateEnabled: true
        })
      });
      
      let data = null;
      try { data = await response.json(); } catch(e){}

      if (!response.ok && response.status !== 400 && data?.code !== 'duplicate_parameter') {
          console.error("Brevo API Error for", contact.email, data);
      }
      results.push({ email: contact.email, status: response.status, data });
    }

    res.json({ success: true, results });
  } catch (e: any) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
}
