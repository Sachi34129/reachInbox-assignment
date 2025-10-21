import React from "react";
import { Inbox, Settings, User } from "lucide-react";
import { motion } from "framer-motion";
import "../styles/inbox.css";

const Sidebar = ({ accounts = [], selectedAccount, onSelectAccount, folders = [], onSelectFolder, selectedFolder }) => {
  return (
    <motion.div
      initial={{ x: -200 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.4 }}
      className="sidebar"
    >
      <div className="sidebar-top">
        <div className="sidebar-section-title">
          <User className="mr-2" size={18} /> Account
        </div>

        <select
          value={selectedAccount}
          onChange={(e) => onSelectAccount(e.target.value)}
          className="account-select"
        >
          {accounts.map((acc) => (
            <option key={acc} value={acc}>
              {acc}
            </option>
          ))}
        </select>

        <div className="sidebar-section-title">Folders</div>
        {folders.length === 0 ? (
          <div className="no-folders">No folders</div>
        ) : (
            folders.map((f) => (
                <div
                  key={f.name}
                  onClick={() => onSelectFolder(f.name)}
                  className={`folder-item ${f.name === selectedFolder ? "active" : ""}`}
                >
                  <Inbox className="mr-2" size={16} /> {f.name}
                  <span
                    className="dot"
                    style={{ backgroundColor: f.color }}
                  />
                </div>
              ))
        )}
      </div>

      <div className="sidebar-bottom">
        <Settings size={20} className="settings-icon" />
      </div>
    </motion.div>
  );
};

export default Sidebar;