// notificationService.ts
import axios from 'axios';

const SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL || 'https://hooks.slack.com/services/T09MGMW1QJG/B09M9PTPVN1/********************';
const EXTERNAL_WEBHOOK_URL = process.env.EXTERNAL_WEBHOOK_URL || 'https://webhook.site/3df07aa2-372d-4c03-b8a2-**********';

/**
 * Send Slack notification for "Interested" emails (plain text with safe characters)
 */
export async function sendSlackNotification(subject: string, from: string, category: string) {
  if (!SLACK_WEBHOOK_URL) {
    console.log('⚠️ SLACK_WEBHOOK_URL not set. Skipping Slack notification.');
    return;
  }

  const normalizedCategory = (category || '').trim().toLowerCase();
  if (normalizedCategory !== 'interested') {
    console.log(`ℹ️ Skipping Slack for category: ${category}`);
    return;
  }

  // Safe plain-text message
  const safeSubject = subject.replace(/[\u{1F600}-\u{1F6FF}]/gu, ''); // remove emojis
  const safeFrom = from.replace(/[\u{1F600}-\u{1F6FF}]/gu, '');
  const message = {
    text: `[${category}] From: ${safeFrom} | Subject: ${safeSubject}`,
  };

  console.log('🔔 Sending Slack message payload:', JSON.stringify(message));

  try {
    const res = await axios.post(SLACK_WEBHOOK_URL, message, {
      headers: { 'Content-Type': 'application/json' },
    });
    console.log(`✅ Slack notification sent for: ${subject}`);
  } catch (err: any) {
    console.error('❌ Failed to send Slack notification:', err.response?.data || err.message);
  }
}

/**
 * Trigger webhook for Interested emails.
 */
export async function triggerWebhook(subject: string, from: string, category: string) {
  if (!EXTERNAL_WEBHOOK_URL) {
    console.log('⚠️ EXTERNAL_WEBHOOK_URL not set. Skipping external webhook.'); // <-- Add this
    return;
  }

  const normalizedCategory = (category || '').trim().toLowerCase();
  if (normalizedCategory !== 'interested') return;

  const payload = {
    event: 'interested_email',
    data: { subject, from, category, timestamp: new Date().toISOString() },
  };

  console.log('🌐 Triggering webhook payload:', JSON.stringify(payload));

  try {
    await axios.post(EXTERNAL_WEBHOOK_URL, payload);
    console.log('✅ Webhook triggered successfully.');
  } catch (err: any) {
    console.error('❌ Failed to trigger webhook:', err.response?.data || err.message);
  }
}
