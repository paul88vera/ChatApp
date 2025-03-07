import { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { createPortal } from "react-dom";
import { IoPaperPlaneSharp } from "react-icons/io5";
import { FaMinus } from "react-icons/fa";

const ChatRoom = ({ close }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!auth.currentUser) {
      navigate("/login"); // Redirect if not logged in
      return;
    }

    const q = query(collection(db, "messages"), orderBy("timestamp"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(
        snapshot.docs.map((doc) => ({
          id: doc.displayName,
          ...doc.data(),
        }))
      );
    });

    return () => unsubscribe();
  }, [navigate]);

  const sendMessage = async () => {
    if (newMessage.trim() === "") return;
    await addDoc(collection(db, "messages"), {
      text: newMessage,
      timestamp: serverTimestamp(),
      user: auth.currentUser.displayName,
    });
    setNewMessage("");
  };

  return createPortal(
    <div id="chatbox-container">
      <button className="close-btn" onClick={close}>
        <FaMinus />
      </button>
      <div className="h-64 overflow-y-auto chat">
        {messages.map((msg, index) => (
          <div className="message-container" key={index}>
            <p key={index}>
              {/* <strong>{msg.user}: </strong> */}
              <span>{msg.text}</span>
            </p>
            <span className="timestamp">
              {new Date(msg.timestamp * 1000).toLocaleTimeString("en-US")}
            </span>
          </div>
        ))}
      </div>
      <div className="chatbox-new-message-container">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="border p-2"
        />
        <button
          onClick={sendMessage}
          className="bg-green-500 px-4 py-2 text-white">
          <IoPaperPlaneSharp />
        </button>
      </div>
    </div>,
    document.querySelector(".container")
  );
};

export default ChatRoom;
