import express from 'express';
import multer from 'multer';
import cors from 'cors';
import path from 'path';
import fs from 'fs/promises';

import 'dotenv/config'
import './config/database.js';

import ConvertHL7ToJSON from './controllers/convert-data-to-json.js';

const app = express();
const { PORT } = process.env;

app.use(cors());

const upload = multer({ dest: 'uploads/' });

app.post('/parse-oru', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const filePath = path.resolve(req.file.path);
    const data = await ConvertHL7ToJSON(filePath);

    await fs.unlink(filePath);

    return res.json({ data });
  } catch (error) {
    console.error('Parsing failed:', error);
    return res.status(500).json({ error: 'Failed to parse HL7 file' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
