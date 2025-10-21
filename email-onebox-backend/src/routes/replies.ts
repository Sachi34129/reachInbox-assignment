import { Router } from 'express';
import { generateReply } from '../services/aiReplies';  // your Ollama call
import { getRelevantContext } from '../services/vectorDB';
import { cleanEmailBody } from '../services/utils';



const router = Router();

router.post('/suggest', async (req, res) => {
  try {
    const { emailBody, emailEmbedding } = req.body;

    if (!emailBody) return res.status(400).json({ error: 'Email body is required' });

    // Retrieve context from your vector DB
    const context = emailEmbedding ? getRelevantContext(emailEmbedding) : '';

    const bodyText = cleanEmailBody(emailBody);
    const reply = await generateReply(bodyText, context);

    res.json({ reply }); // ✅ must respond with JSON object
  } catch (err) {
    console.error('❌ Error generating AI reply:', err);
    res.status(500).json({ reply: 'Sorry, unable to generate a reply.' });
  }
});

export default router;