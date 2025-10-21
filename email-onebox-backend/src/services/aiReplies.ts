import { spawn } from 'child_process';

export async function generateReply(emailBody: string, context: string): Promise<string> {
  const truncatedBody = emailBody.length > 2000 ? emailBody.slice(0, 2000) + '...' : emailBody;

  const prompt = `
You are a professional assistant. Using the context below, generate a concise, polite, professional reply to the email.

CONTEXT:
${context}

EMAIL:
${truncatedBody}

INSTRUCTIONS:
- Keep it concise (1-3 sentences).
- Do NOT include emojis or extra commentary.
- Make it actionable if required.
- Output ONLY the reply text.
`;

  return new Promise((resolve) => {
    const child = spawn('ollama', ['run', 'gemma3:4b'], { stdio: ['pipe', 'pipe', 'pipe'] });

    let output = '';
    let errorOutput = '';

    child.stdout.on('data', (data) => (output += data.toString()));
    child.stderr.on('data', (data) => (errorOutput += data.toString()));

    child.on('close', (code) => {
      if (code !== 0) {
        console.error('❌ AI reply generation failed:', errorOutput.trim());
        resolve('Sorry, unable to generate a reply.');
      } else {
        resolve(output.trim());
      }
    });

    child.stdin.write(prompt);
    child.stdin.end();
  });
}