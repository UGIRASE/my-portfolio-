
import { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
  query,
  orderBy
} from "firebase/firestore";

import { db } from "../services/firebase";

function MessageManagement() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const messagesQuery = query(
      collection(db, "messages"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(
      messagesQuery,
      (snapshot) => {
        const data = snapshot.docs.map((item) => ({
          id: item.id,
          ...item.data()
        }));

        setMessages(data);
        setLoading(false);
      },
      (error) => {
        console.error("Messages error:", error);
        setError(error.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const markAsRead = async (id) => {
    try {
      await updateDoc(doc(db, "messages", id), {
        read: true
      });
    } catch (error) {
      alert("Error updating message: " + error.message);
    }
  };

  const deleteMessage = async (id) => {
    if (!window.confirm("Are you sure you want to delete this message?")) {
      return;
    }

    try {
      await deleteDoc(doc(db, "messages", id));
    } catch (error) {
      alert("Error deleting message: " + error.message);
    }
  };

  const unreadCount = messages.filter(
    (message) => message.read !== true
  ).length;

  if (loading) {
    return <p>Loading messages...</p>;
  }

  return (
    <div className="management-section">
      <h2>Messages Management</h2>

      <p>Total Messages: {messages.length}</p>
      <p>Unread Messages: {unreadCount}</p>

      {error && <p className="error-message">{error}</p>}

      {messages.length === 0 ? (
        <p>No messages received yet.</p>
      ) : (
        <div className="messages-list">
          {messages.map((message) => (
            <div className="message-card" key={message.id}>
              <div className="message-header">
                <h3>{message.name}</h3>

                <span>
                  {message.read ? "Read" : "Unread"}
                </span>
              </div>

              <p><strong>Email:</strong> {message.email}</p>

              {message.subject && (
                <p><strong>Subject:</strong> {message.subject}</p>
              )}

              <p><strong>Message:</strong></p>
              <p>{message.message}</p>

              {message.createdAt && (
                <p>
                  <small>
                    Received: {new Date(
                      message.createdAt
                    ).toLocaleString()}
                  </small>
                </p>
              )}

              <div className="message-actions">
                {!message.read && (
                  <button onClick={() => markAsRead(message.id)}>
                    Mark as Read
                  </button>
                )}

                <button
                  className="delete-cv-button"
                  onClick={() => deleteMessage(message.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MessageManagement;
