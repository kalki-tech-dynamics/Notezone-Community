import React, { useState } from 'react';
import { FaUsers, FaTag, FaAlignLeft } from 'react-icons/fa';

const CreateGroup = ({ onCreated, apiBase }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);

  
     const [user, setUser] = useState(null);
     
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
                 }
             };
     
             fetchUser();
         }, []);
     
  
         
  
         const [user_id, setuser_id] = useState(user?.id || "guest-id");

  async function handleCreate(e) {
    e.preventDefault();
    setLoading(true);
    const res = await fetch(`${apiBase}/groups`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-user-id': user_id },
      body: JSON.stringify({ name, description, topic })
    });
    const json = await res.json();
    setLoading(false);
    if (res.ok) {
      setName(''); setDescription(''); setTopic('');
      onCreated && onCreated(json.group);
    } else {
      alert(json.error?.message || 'Failed to create');
    }
  }

  return (
       <div className="create-wrap-full">
      <form className="create-form-full" onSubmit={handleCreate}>
        <h2>Create New Group</h2>

        <div className="input-icon-full">
          <FaUsers className="icon" />
          <input 
            value={name} 
            onChange={e => setName(e.target.value)} 
            placeholder="Group name" 
            required 
          />
        </div>

        <div className="input-icon-full">
          <FaTag className="icon" />
          <input 
            value={topic} 
            onChange={e => setTopic(e.target.value)} 
            placeholder="Topic name" 
          />
        </div>

        <div className="input-icon-full">
          <FaAlignLeft className="icon" />
          <input 
            value={description} 
            onChange={e => setDescription(e.target.value)} 
            placeholder="Description" 
            rows={6} 
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create Group'}
        </button>
      </form>
    </div>
  );
}

export default CreateGroup;
