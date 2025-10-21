// src/api/emailApi.js
import axios from 'axios';

const API_BASE = 'http://localhost:5000'; // backend URL

export async function getEmails() {
  try {
    const res = await axios.get(`${API_BASE}/emails/search`);
    return res.data; // array of emails from backend
  } catch (err) {
    console.error('Failed to fetch emails from backend:', err);
    return [];
  }
}

export async function getReplySuggestions(emailId) {
  // Keep placeholder for now
  return [
    "Sure, sounds good!",
    "Can we reschedule?",
    "Thanks for the update.",
  ];
}

export async function sendReply(emailId, message) {
  console.log(`Sending reply to email ${emailId}: ${message}`);
  return { success: true };
}