import React, { useEffect, useState, useRef } from 'react';
import { FaPaperPlane, FaTimes } from 'react-icons/fa';
const ChatPanel=({ group, onClose, apiBase })=> {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const pollRef = useRef(null);
 const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch(`${BASE_URL}/decode`, {
                    method: "GET",
                    credentials: "include",
                });

                const data = await res.json();

                if (res.ok && data.noteuser) {
                    setUser(data.noteuser);
                    localStorage.setItem("noteuser", JSON.stringify(data.noteuser));
                } 
            } catch (err) {
                console.error(err);
                setTimeout(() => {
                    localStorage.removeItem("noteuser");
                    window.location.href = "https://notezone.in/login";
                }, 1000000);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

        const [user_id, setuser_id] = useState(user?.id || "guest-id");

  useEffect(() => {
    fetchAllGroups();
    fetchJoinedGroups();
  }, [refresh]);

  async function fetchAllGroups() {
    const res = await fetch(`${API_BASE}/groups`);
    const json = await res.json();
    setAllGroups(json.groups || []);
  }

  useEffect(() => {
  fetchAllGroups();
  fetchJoinedGroups();
}, []);


  useEffect(() => {
    if (!group) return;
    fetchMessages();

    pollRef.current = setInterval(fetchMessages, 2000);
    return () => clearInterval(pollRef.current);
  }, [group]);

  async function fetchMessages() {
    const res = await fetch(`${apiBase}/groups/${group.id}/messages?limit=200`);
    if (!res.ok) return;
    const json = await res.json();
    setMessages(json.messages || []);
  }

  async function sendMessage(e) {
    e.preventDefault();
    if (!text.trim()) return;
    const res = await fetch(`${apiBase}/groups/${group.id}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-user-id': user_id },
      body: JSON.stringify({ content: text })
    });
    if (res.ok) {
      setText('');
      fetchMessages();
    } else {
      alert('Failed to send');
    }
  }

  return (
    <div className="chat-panel">
 <div className="chat-header">
  <div style={{display:'flex', alignItems:'center'}}>
    <strong>{group.name}</strong>
  </div>
  <button className="close-btn" onClick={onClose}><FaTimes /></button>
</div>

      <div className="chat-messages">
  {messages.map(m => (
    <div key={m.id} className={`chat-msg ${m.user_id === user_id ? 'mine' : ''}`}>
      <div className="msg-user">{m.user_id}</div>
      <div className="msg-body">{m.content}</div>
      <div className="msg-time">{new Date(m.created_at).toLocaleTimeString()}</div>
    </div>
  ))}
</div>

<form className="chat-send" onSubmit={sendMessage}>
  <input value={text} onChange={e=>setText(e.target.value)} placeholder="Type a message..." />
  <button type="submit"><FaPaperPlane /></button>
</form>
    </div>
  );
}
export default ChatPanel;