// server.js
const express = require('express');
const bodyParser = require('body-parser');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const app = express();
const cors = require('cors')
const userRoute = require('./routes/userRoute')
const connectDB = require('./utils/db');
const { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');

connectDB();
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true
}));
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(express.json());

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
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// Upload file to S3
async function uploadFile(filePath, key) {
  try {
    const fileContent = fs.readFileSync(filePath);
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key, // e.g., 'folder/filename.ext'
      Body: fileContent,
    };
    const command = new PutObjectCommand(params);
    const data = await s3Client.send(command);
    console.log(`File uploaded successfully: ${key}`, data);
    return data;
  } catch (err) {
    console.error('Error uploading file:', err);
    throw err;
  }
}

// Retrieve (download) file from S3
async function downloadFile(key, downloadPath) {
  try {
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
    };
    const command = new GetObjectCommand(params);
    const data = await s3Client.send(command);
    const body = await data.Body.transformToByteArray();
    fs.writeFileSync(downloadPath, Buffer.from(body));
    console.log(`File downloaded successfully: ${downloadPath}`);
    return data;
  } catch (err) {
    console.error('Error downloading file:', err);
    throw err;
  }
}

// Delete file from S3
async function deleteFile(key) {
  try {
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
    };
    const command = new DeleteObjectCommand(params);
    const data = await s3Client.send(command);
    console.log(`File deleted successfully: ${key}`);
    return data;
  } catch (err) {
    console.error('Error deleting file:', err);
    throw err;
  }
}
app.listen(process.env.PORT, () => console.log(`Server connected to http://localhost:${process.env.PORT}`));