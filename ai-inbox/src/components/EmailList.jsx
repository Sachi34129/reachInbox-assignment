import React from "react";
import { motion } from "framer-motion";

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  const now = new Date();
  const diffTime = now - date;
  const diffDays = diffTime / (1000 * 60 * 60 * 24);

  if (diffDays < 1) {
    // Within today
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } else if (diffDays < 2) {
    return "Yesterday";
  } else if (date.getFullYear() === now.getFullYear()) {
    return date.toLocaleDateString([], { month: "short", day: "numeric" });
  } else {
    return date.toLocaleDateString([], { year: "numeric", month: "short", day: "numeric" });
  }
};

const EmailList = ({ emails, folders, onSelect, pagination, onPageChange }) => {
  return (
    <div className="flex flex-col flex-1 bg-gray-800 text-white overflow-hidden">
      <div className="flex-1 overflow-y-auto">
        {emails.map((email, idx) => (
          <motion.div
            key={email.id || idx}
            className="email-item"
            onClick={() => onSelect(email)}
            whileHover={{ scale: 1.01 }}
          >
            <span
                className="category-dot"
                style={{
                    backgroundColor: folders.find(f => f.name === email.category)?.color || "#888"
                }}
                />
            <div className="email-info">
              <div className="email-subject">{email.subject}</div>
              <div className="email-snippet">
                {email.body?.slice(0, 80) || "No preview available..."}
              </div>
            </div>
            <div className="email-time">{formatDate(email.date)}</div>
          </motion.div>
        ))}
      </div>

      <div className="p-2 flex justify-between border-t border-gray-700">
        <button
          disabled={!pagination.hasPrev}
          onClick={() => onPageChange("prev")}
          className={`px-3 py-1 rounded ${pagination.hasPrev ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-700 opacity-50"}`}
        >
          Prev
        </button>
        <button
          disabled={!pagination.hasNext}
          onClick={() => onPageChange("next")}
          className={`px-3 py-1 rounded ${pagination.hasNext ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-700 opacity-50"}`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default EmailList;