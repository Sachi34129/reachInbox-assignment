import React from "react";

export default function EmailDetail({ email }) {
  return (
    <div className="flex-1 p-4 border-b border-gray-700 overflow-y-auto">
      <h2 className="text-lg font-bold mb-2">{email.subject}</h2>
      <h3 className="text-gray-400 mb-4">{email.from}</h3>
      <div
        className="email-body whitespace-pre-wrap"
        dangerouslySetInnerHTML={{ __html: email.body }}
      />
    </div>
  );
}