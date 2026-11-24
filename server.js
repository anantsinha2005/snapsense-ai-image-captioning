require('dotenv').config();
const express = require('express');
const multer = require('multer');
const path = require('path');
const { GoogleGenAI } = require('@google/genai');

const app = express();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 8 * 1024 * 1024 }, fileFilter: (_req, file, cb) => {
  if (!file.mimetype.startsWith('image/')) return cb(new Error('Please upload an image file.'));
  cb(null, true);
}});
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json({ limit: '1mb' }));

const ai = process.env.GEMINI_API_KEY ? new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY }) : null;
app.get('/api/health', (_req, res) => res.json({ ok: true, configured: Boolean(ai) }));
app.post('/api/analyze', upload.single('image'), async (req, res) => {
  try {
    if (!ai) return res.status(503).json({ error: 'Gemini API key is not configured. Add it to your .env file.' });
    if (!req.file) return res.status(400).json({ error: 'Choose an image first.' });
    const style = req.body.style || 'Detailed';
    const instruction = {
      Short: 'Write one concise, accurate caption (1 sentence).',
      Detailed: 'Write an informative caption in 2-4 sentences, describing key visible elements and context without speculation.',
      Accessibility: 'Write an accessibility-focused alt text description. Prioritize the essential visual information and avoid unnecessary embellishment.',
      Creative: 'Write a vivid but grounded caption. Do not invent details not visible in the image.'
    }[style] || 'Write an informative caption in 2-4 sentences.';
    const prompt = `${instruction} Then add a short section titled "Visible details" with 3-5 bullet points. Only describe what is visible; note uncertainty where appropriate. Avoid identifying people or inferring sensitive attributes.`;
    const result = await ai.models.generateContent({
      model: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
      contents: [{ role: 'user', parts: [ { text: prompt }, { inlineData: { mimeType: req.file.mimetype, data: req.file.buffer.toString('base64') } } ] }]
    });
    res.json({ caption: result.text || 'No caption returned.' });
  } catch (err) {
    console.error('Image analysis error:', err.message);
    res.status(500).json({ error: err.message || 'Image analysis failed.' });
  }
});
app.use((err, _req, res, _next) => res.status(err.status || 400).json({ error: err.message || 'Request failed.' }));
const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`SnapSense AI by Anant Sinha running at http://localhost:${port}`));
