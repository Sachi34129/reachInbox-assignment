// aiCatogorization.ts
import { spawn } from 'child_process';

const validCategories = [
  'Interested',
  'Meeting Booked',
  'Not Interested',
  'Spam',
  'Out of Office',
];

const MAX_RETRIES = 2; // Number of retries for invalid outputs

export async function categorizeEmail(
  subject: string,
  body: string
): Promise<string> {
  // Truncate body for efficiency
  const truncatedBody = body.length > 2000 ? body.slice(0, 2000) + '...' : body;

  // Construct a very strict prompt
  const prompt = `
    You are an AI email assistant. Categorize the email into exactly one category from:

    - Interested: actionable offers, job opportunities, financial benefits
    - Meeting Booked: confirmations, appointments, calendar invites
    - Not Interested: personal newsletters, informational emails
    - Spam: scams, phishing, repeated marketing
    - Out of Office: autoreplies indicating absence

    RULES:
    - Respond with ONLY the category name exactly as listed.
    - Do NOT include reasoning, emojis, or extra text.
    - If unsure, respond with 'Uncategorized'.

    Email Subject: ${subject}
    Email Body: ${truncatedBody}

    CATEGORY:
    `;

  // Function to call the LLM via spawn
  const runLLM = (): Promise<string> =>
    new Promise((resolve) => {
      const child = spawn('ollama', ['run', 'gemma3:4b'], { stdio: ['pipe', 'pipe', 'pipe'] });

      let output = '';
      let errorOutput = '';

      child.stdout.on('data', (data) => (output += data.toString()));
      child.stderr.on('data', (data) => (errorOutput += data.toString()));

      child.on('close', (code) => {
        if (code !== 0) {
          console.error('❌ AI categorization failed:', errorOutput.trim());
          resolve('Uncategorized');
        } else {
          // Take first line and sanitize output
          const category = output.trim().split(/\n|[:]/)[0];
          resolve(validCategories.includes(category) ? category : 'Uncategorized');
        }
      });

      // Send the prompt
      child.stdin.write(prompt);
      child.stdin.end();
    });

  // Retry mechanism
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    const category = await runLLM();
    if (validCategories.includes(category)) {
      return category;
    } else if (attempt < MAX_RETRIES) {
      console.warn(
        `⚠️ Invalid LLM output on attempt ${attempt + 1}. Retrying...`
      );
    } else {
      console.error('❌ LLM failed to provide a valid category. Using Uncategorized.');
      return 'Uncategorized';
    }
  }

  // Fallback (should not reach here)
  return 'Uncategorized';
}