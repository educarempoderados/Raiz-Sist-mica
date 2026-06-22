const http = require('http');

const req = http.request(
  {
    hostname: 'localhost',
    port: 3000,
    path: '/api/brevo/sync',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  },
  (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => console.log('STATUS:', res.statusCode, 'DATA:', data));
  }
);
req.write(JSON.stringify({ contacts: [{ email: "test@example.com", nome: "Test", whatsapp: "5511999999999" }] }));
req.end();
