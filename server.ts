import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '50mb' }));

  // API Route to add contact to Brevo
  app.post("/api/brevo/contact", async (req, res) => {
    try {
      const { email, nome, whatsapp } = req.body;
      const apiKey = process.env.BREVO_API_KEY;

      if (!apiKey) {
        return res.status(500).json({ error: "Brevo API Key not configured" });
      }

      // Add contact to Brevo
      const response = await fetch("https://api.brevo.com/v3/contacts", {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          "api-key": apiKey
        },
        body: JSON.stringify({
          email: email,
          attributes: {
            NOME: nome,
            SMS: "55" + whatsapp.replace(/\D/g, '')
          },
          updateEnabled: true
        })
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Brevo API Error:", data);
        return res.status(response.status).json({ error: data.message });
      }

      res.json({ success: true, data });
    } catch (e: any) {
      console.error(e);
      res.status(500).json({ error: e.message });
    }
  });

  // API Route to sync multiple contacts to Brevo
  app.post("/api/brevo/sync", async (req, res) => {
    try {
      const { contacts } = req.body; // array of {email, nome, whatsapp}
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
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
