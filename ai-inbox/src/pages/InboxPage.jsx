import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import EmailList from "../components/EmailList";
import EmailDetail from "../components/EmailDetail";
import AIReplyPanel from "../components/EmailPreview";
import { useEmails } from "../hooks/useEmails";
import "../styles/inbox.css";

export default function InboxPage() {
  // --- Accounts & Folders ---
  const accounts = ["sachi34129@gmail.com", "vinod.nitha75@gmail.com"];
  const folders = [
    { name: "Interested", color: "#4db6ac" },
    { name: "Meeting Booked", color: "#2ecc71" },
    { name: "Not Interested", color: "#3498db" },
    { name: "Spam", color: "#e74c3c" },
    { name: "Out of Office", color: "#f39c12" },
  ];

  // --- State ---
  const [selectedAccount, setSelectedAccount] = useState(accounts[0]);
  const [selectedFolder, setSelectedFolder] = useState(folders[0].name);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  // --- Debounce search ---
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedQuery(searchQuery), 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // --- Fetch emails ---
  const { emails, pagination, loading } = useEmails(
    selectedAccount,
    page,
    15,
    debouncedQuery,
    "date",
    "desc",
    selectedFolder
  );

  // --- Filter emails by selected folder/category ---
  const filteredEmails = emails.filter((email) => email.category === selectedFolder);

  // --- Pagination handlers ---
  const handlePageChange = (direction) => {
    if (direction === "next" && pagination.hasNext) setPage((p) => p + 1);
    if (direction === "prev" && pagination.hasPrev) setPage((p) => p - 1);
  };

  const goToPage = (p) => setPage(p);

  return (
    <div className="inbox-page">
      {/* Header */}
      <header className="inbox-header">
        <h1>AI-Powered Unified Inbox</h1>
        <div className="inbox-header-actions">
          <input
            type="text"
            placeholder="Search..."
            className="search-input"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1); // reset to first page on search
            }}
          />
          <button className="compose-btn">Compose</button>
        </div>
      </header>

      <div className="inbox-container">
        {/* Sidebar */}
        <Sidebar
          accounts={accounts}
          folders={folders}
          selectedAccount={selectedAccount}
          onSelectAccount={(acc) => {
            setSelectedAccount(acc);
            setPage(1);
          }}
          onSelectFolder={(folder) => {
            setSelectedFolder(folder);
            setPage(1);
          }}
          selectedFolder={selectedFolder}
        />

        {/* Main Inbox */}
        <div className="inbox-main">
          <div className="email-list-section">
            {loading ? (
              <div className="loading">Loading emails...</div>
            ) : filteredEmails.length === 0 ? (
              <div className="no-emails">No emails found.</div>
            ) : (
              <EmailList
                emails={filteredEmails}
                folders={folders}
                onSelect={setSelectedEmail}
                pagination={pagination}
                onPageChange={handlePageChange}
              />
            )}
          </div>

          {/* Email Details & AI Panel */}
          <div className="email-right-section">
            <div className="email-detail-section">
              {selectedEmail ? (
                <EmailDetail email={selectedEmail} />
              ) : (
                <div className="no-email">Select an email to view</div>
              )}
            </div>

            <div className="ai-panel-section">
              <AIReplyPanel
                email={selectedEmail}
                suggestions={["Sure, sounds good!", "Can we reschedule?", "Thanks for the update."]}
                onSend={(reply) => console.log("Send:", reply)}
                onDismiss={() => setSelectedEmail(null)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}