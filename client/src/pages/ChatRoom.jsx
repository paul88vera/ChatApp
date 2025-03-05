import { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const ChatRoom = () => {
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
      setMessages(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
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

  return (
    <div>
      <div className="h-64 overflow-y-auto">
        {messages.map((msg) => (
          <p key={msg.id}>
            <strong>{msg.user}:</strong> {msg.text}
          </p>
        ))}
      </div>
      <input
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        className="border p-2"
      />
      <button onClick={sendMessage} className="bg-green-500 px-4 py-2 text-white">
        Send
      </button>
    </div>
  );
};

export default ChatRoom;
