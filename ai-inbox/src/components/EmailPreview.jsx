import React, { useState, useEffect } from 'react';

export default function AIReplyPanel({ email, onSend, onDismiss }) {
  const [suggestedReply, setSuggestedReply] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!email) return;

    setLoading(true);
    fetch('http://localhost:5000/suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emailBody: email.body, emailEmbedding: null }),
      })
        .then(async (res) => {
          if (!res.ok) throw new Error('Network response was not ok');
          try {
            const data = await res.json();
            setSuggestedReply(data.reply || 'Sorry, no reply generated.');
          } catch (err) {
            console.error('❌ Invalid JSON:', err);
            setSuggestedReply('Sorry, unable to generate a reply.');
          }
        })
        .catch((err) => {
          console.error('❌ Fetch error:', err);
          setSuggestedReply('Sorry, unable to generate a reply.');
        })
        .finally(() => setLoading(false));
  }, [email]);

  return (
    <div className="ai-panel p-4 border-t border-gray-700">
      <h4 className="font-semibold mb-2">AI Suggested Reply</h4>
      {loading ? (
        <div>Generating reply...</div>
      ) : (
        <>
          <div className="reply-box mb-2 whitespace-pre-wrap">{suggestedReply}</div>
          <div className="flex gap-2">
            <button onClick={() => onSend(suggestedReply)} className="bg-blue-500 text-white px-3 py-1 rounded">
              Send
            </button>
            <button onClick={onDismiss} className="bg-gray-700 text-white px-3 py-1 rounded">
              Dismiss
            </button>
          </div>
        </>
      )}
    </div>
  );
}