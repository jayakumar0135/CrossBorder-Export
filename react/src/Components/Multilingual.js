import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import './Multilingual.css'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome,faHistory , faCheckCircle, faLanguage, faConciergeBell, faAddressBook } from '@fortawesome/free-solid-svg-icons';

const Multilingual = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);

  const [clientId, setClientId] = useState("");
  const [recipient, setRecipient] = useState("");
  const [message, setMessage] = useState("");
  const [language, setLanguage] = useState("en");
  const [messages, setMessages] = useState([]);
  const chatBoxRef = useRef(null);
  const [socket, setSocket] = useState(null);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Prompt user for Client ID and initialize WebSocket
  useEffect(() => {
    const id = prompt("Enter your unique Client ID:") || "guest";
    setClientId(id);

    const ws = new WebSocket(`ws://127.0.0.1:8000/ws/${id}`);
    setSocket(ws);

    ws.onmessage = (event) => {
      const incomingMessage = event.data;
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: incomingMessage, type: "incoming" },
      ]);
    };

    return () => {
      ws.close();
    };
  }, []);

  // Scroll to the bottom of the chat box when messages update
  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  // Handle sending a message
  const handleSendMessage = () => {
    if (!recipient || !message.trim()) {
      alert("Please enter both recipient ID and a message.");
      return;
    }

    const data = {
      to: recipient,
      text: message.trim(),
      lang: language,
    };

    if (socket) {
      socket.send(JSON.stringify(data));
    }

    setMessages((prevMessages) => [
      ...prevMessages,
      { text: `To ${recipient}: ${message}`, type: "outgoing" },
    ]);

    setMessage(""); // Clear input field
  };

  return (
    <div id="app4">
      {/* Navbar */}
      <nav className="navbar">
        <h1 className="navbar-title">CROSSBORDER-EXPORT-CHECKER</h1>
      </nav>

      <div className="contains">
        {/* Sidebar */}
        <aside className={`sidebar ${isSidebarOpen ? "open" : "closed"}`}>
          <button className="toggle-btn" onClick={toggleSidebar}>
            {isSidebarOpen ? "X" : "☰"}
          </button>
          <ul className="sidebar-links">
      <li>
        <Link to="/home">
          <FontAwesomeIcon icon={faHome} /> Home
        </Link>
      </li>
      <li>
        <Link to="/crossborder">
          <FontAwesomeIcon icon={faCheckCircle} /> Verification
        </Link>
      </li>
      <li>
        <Link to="/multilingual">
          <FontAwesomeIcon icon={faLanguage} /> Multilingual
        </Link>
      </li>
      <li>
        <Link to="/user_history">
          <FontAwesomeIcon icon={faHistory } /> PostShipment
        </Link>
      </li>
      <li>
        <Link to="/contacts">
          <FontAwesomeIcon icon={faAddressBook} /> Contacts
        </Link>
      </li>
      
    </ul>
        </aside>

        <main className="content">
          <div>
            <h1>Real-Time Multi-User Multi-Lingual Chat</h1>

            <div
              id="chat-box"
              ref={chatBoxRef}
              style={{
                border: "1px solid black",
                height: "300px",
                overflowY: "auto",
                padding: "10px",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`message ${msg.type}`}
                  style={{
                    margin: "5px 0",
                    padding: "10px",
                    borderRadius: "5px",
                    maxWidth: "60%",
                    alignSelf:
                      msg.type === "incoming" ? "flex-start" : "flex-end",
                    backgroundColor:
                      msg.type === "incoming" ? "#f1f0f0" : "#d1e7dd",
                  }}
                >
                  {msg.text}
                </div>
              ))}
            </div>
            <br />

            <div className="message-form">
  <input
    id="message"
    type="text"
    placeholder="Enter your message"
    value={message}
    onChange={(e) => setMessage(e.target.value)}
    className="input-field"
  />
  <input
    id="recipient"
    type="text"
    placeholder="Recipient ID"
    value={recipient}
    onChange={(e) => setRecipient(e.target.value)}
    className="input-field"
  />
  <select
    id="language"
    value={language}
    onChange={(e) => setLanguage(e.target.value)}
    className="input-field"
  >
    <option value="en">English</option>
    <option value="fr">French</option>
    <option value="es">Spanish</option>
    <option value="hi">Hindi</option>
    <option value="zh">Chinese</option>
  </select>
  <button onClick={handleSendMessage} className="send-button">Send</button>
</div>

          </div>
        </main>
      </div>
    </div>
  );
};

export default Multilingual;
