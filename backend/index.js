// server.js
const express = require('express');
const bodyParser = require('body-parser');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const app = express();
const cors = require('cors')
const http = require('http');
const userRoute = require('./routes/userRoute')
const connectDB = require('./utils/db');
const redisClient = require('./utils/redis');
require('dotenv').config();
connectDB();
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true
}));
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(express.json());

// Proxy route: forward POST /ai/recommend -> http://localhost:9000/recommend
app.post('/ai/recommend', (req, res) => {
  const data = JSON.stringify(req.body || {});
  const options = {
    hostname: 'localhost',
    port: 9000,
    path: '/recommend',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(data)
    }
  };

  const proxyReq = http.request(options, (proxyRes) => {
    let body = '';
    proxyRes.setEncoding('utf8');
    proxyRes.on('data', (chunk) => { body += chunk; });
    proxyRes.on('end', () => {
      // Forward status and headers
      res.status(proxyRes.statusCode || 200);
      Object.entries(proxyRes.headers || {}).forEach(([k,v]) => {
        try { res.setHeader(k, v); } catch (e) {}
      });
      // Send raw body
      try { res.send(JSON.parse(body)); } catch (e) { res.send(body); }
    });
  });

  proxyReq.on('error', (err) => {
    res.status(502).json({ error: 'AI helper unreachable', details: err.message });
  });

  proxyReq.write(data);
  proxyReq.end();
});

// Endpoint to process LaTeX
/*app.post('/generate-resume', async (req, res) => {
  const tempDir = './Templates';
  const { fullName } = req.body;

  try {
    // 1. Generate LaTeX
    const texContent = `\\documentclass{article}\\begin{document}Sourish Bhattacharjee\\end{document}`;
    const texPath = `${tempDir}/resume.tex`;
    fs.writeFileSync(texPath, texContent);

    // 2. Compile PDF
    await exec(`pdflatex -output-directory=${tempDir} ${texPath}`);

    // 3. Convert to PNG (using Ghostscript directly)
    const pdfPath = `${tempDir}/resume.pdf`;
    const pngPath = `${tempDir}/resume.png`;
    
    await exec(`gs -dNOPAUSE -dBATCH -sDEVICE=png16m -r100 -sOutputFile=${pngPath} ${pdfPath}`);

    // 4. Return as base64-encoded image
    const imageBuffer = fs.readFileSync(pngPath);
    const base64Image = imageBuffer.toString('base64');
    
    res.json({
      success: true,
      image: `data:image/png;base64,${base64Image}`
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});*/

//testing
app.get('/', (req, res) => {
  res.send('Server is running');
});
app.post('/', async(req,res)=>{
  res.send('server running');
})

app.use('/',userRoute)
app.use('/',require('./routes/resumeRoute'));
// Initialize S3 client




app.listen(process.env.PORT, () => console.log(`Server connected to http://localhost:${process.env.PORT}`));