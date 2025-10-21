// imapService.ts
import imaps from 'imap-simple';
import { simpleParser } from 'mailparser';
import { getImapConfig } from '../config/imapConfig';
import { saveEmail } from './emailStorage';
import { categorizeEmail } from './aiCategorization';
import { sendSlackNotification, triggerWebhook } from './notificationService'; 

const DAYS = 30;
const FOLDERS_TO_SYNC = ['INBOX', '[Gmail]/Sent Mail', '[Gmail]/Drafts'];

// --- Helper function for timing ---
const recordTiming = (
  stats: { total: number; count: number },
  durationMs: number
) => {
  stats.total += durationMs;
  stats.count += 1;
  return (stats.total / stats.count).toFixed(2);
};

// --- Main email sync function ---
export const startEmailSync = async (accounts: { email: string; password: string }[]) => {
  for (const acc of accounts) {
    console.log(`🔗 Connecting to IMAP account: ${acc.email}`);
    const connection = await imaps.connect(getImapConfig(acc.email, acc.password));
    console.log(`✅ Connected to ${acc.email}`);

    // Track average categorization time per account
    const categorizationStats = { total: 0, count: 0 };

    for (const folder of FOLDERS_TO_SYNC) {
      try {
        await connection.openBox(folder);
        console.log(`📂 Syncing folder: ${folder}`);

        const since = new Date();
        since.setDate(since.getDate() - DAYS);

        const searchCriteria = [['SINCE', since.toISOString()]];
        const fetchOptions = {
          bodies: ['HEADER.FIELDS (FROM TO SUBJECT DATE)', 'TEXT'],
          markSeen: false,
        };

        const messages = await connection.search(searchCriteria, fetchOptions);

        // const recentMessages = messages.slice(-15);

        for (const msg of messages as any[]) {
          try {
            const bodyPart = msg.parts.find((p: any) => p.which === 'TEXT');
            const headerPart = msg.parts.find(
              (p: any) => p.which === 'HEADER.FIELDS (FROM TO SUBJECT DATE)'
            );

            const parsed = await simpleParser(bodyPart?.body || '');
            const subject = headerPart?.body?.subject?.[0] || parsed.subject || '(No Subject)';
            const from = headerPart?.body?.from?.[0] || parsed.from?.text || '(Unknown Sender)';
            const date = new Date(headerPart?.body?.date?.[0] || parsed.date || Date.now());
            const content = parsed.text || parsed.html || '';

            console.log(`📧 [${acc.email}] (${folder}) ${subject} - From: ${from}`);

            const startTime = Date.now();
            const category = await categorizeEmail(subject, content);
            const durationMs = Date.now() - startTime;
            const avgTime = recordTiming(categorizationStats, durationMs);

            console.log(
              `📬 Categorized as: ${category} (⏱️ ${(durationMs / 1000).toFixed(
                2
              )}s | Avg: ${(Number(avgTime) / 1000).toFixed(2)}s)`
            );

            await saveEmail({
              subject,
              from,
              body: content,
              date,
              account: acc.email,
              folder,
              category,
            });
            // Before calling Slack in imapService.ts:
            const normalizedCategory = (category || '').trim().toLowerCase();
            if (normalizedCategory === 'interested') {
              console.log(`📢 Sending Slack & webhook for "${subject}" from "${from}"`);
              try {
                await sendSlackNotification(subject, from, category);
              } catch (err) {
                console.error('❌ Slack failed:', err);
              }
              try {
                await triggerWebhook(subject, from, category);
              } catch (err) {
                console.error('❌ Webhook failed:', err);
              }
            } else {
              console.log(`ℹ️ Skipping Slack for category: ${category}`);
            }
          } catch (err) {
            console.error('❌ Failed to process historical email:', err);
          }
        }

        // --- Real-time sync for new messages ---
        connection.on('mail', async () => {
          console.log(`📩 New email detected in ${folder} (${acc.email})`);
          const newMessages = await connection.search(['UNSEEN'], fetchOptions);

          for (const msg of newMessages as any[]) {
            try {
              const bodyPart = msg.parts.find((p: any) => p.which === 'TEXT');
              const headerPart = msg.parts.find(
                (p: any) => p.which === 'HEADER.FIELDS (FROM TO SUBJECT DATE)'
              );

              const parsed = await simpleParser(bodyPart?.body || '');
              const subject = headerPart?.body?.subject?.[0] || parsed.subject || '(No Subject)';
              const from = headerPart?.body?.from?.[0] || parsed.from?.text || '(Unknown Sender)';
              const date = new Date(headerPart?.body?.date?.[0] || parsed.date || Date.now());
              const content = parsed.text || parsed.html || '';

              console.log(`📬 [${acc.email}] (${folder}) ${subject} - From: ${from}`);

              const startTime = Date.now();
              const category = await categorizeEmail(subject, content);
              const durationMs = Date.now() - startTime;
              const avgTime = recordTiming(categorizationStats, durationMs);

              console.log(
                `📬 Categorized new email as: ${category} (⏱️ ${(durationMs / 1000).toFixed(
                  2
                )}s | Avg: ${(Number(avgTime) / 1000).toFixed(2)}s)`
              );

              await saveEmail({
                subject,
                from,
                body: content,
                date,
                account: acc.email,
                folder,
                category,
              });
              // Before calling Slack in imapService.ts:
              const normalizedCategory = (category || '').trim().toLowerCase();
              if (normalizedCategory === 'interested') {
                console.log(`📢 Sending Slack & webhook for "${subject}" from "${from}"`);
                try {
                  await sendSlackNotification(subject, from, category);
                } catch (err) {
                  console.error('❌ Slack failed:', err);
                }
                try {
                  await triggerWebhook(subject, from, category);
                } catch (err) {
                  console.error('❌ Webhook failed:', err);
                }
              } else {
                console.log(`ℹ️ Skipping Slack for category: ${category}`);
              }
            } catch (err) {
              console.error('❌ Failed to process new email:', err);
            }
          }
        });
      } catch (err) {
        console.error(
          `⚠️ Could not open folder "${folder}" for ${acc.email}:`,
          (err as Error).message
        );
      }
    }

    // Final average summary per account
    if (categorizationStats.count > 0) {
      const avgSeconds = (categorizationStats.total / categorizationStats.count / 1000).toFixed(2);
      console.log(
        `📊 [${acc.email}] Average categorization time: ${avgSeconds}s across ${categorizationStats.count} emails`
      );
    }
  }
};