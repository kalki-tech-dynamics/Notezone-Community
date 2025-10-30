import { FaUsers, FaRegCalendarAlt } from 'react-icons/fa';
import React, { useEffect,useState } from 'react';
import BASE_URL from "../Services/Base_URL.jsx";
const API_BASE = BASE_URL;

const GroupsList =({ groups, onOpen, apiBase, joinedGroupsIds }) => {
  if (!groups || groups.length === 0) return <div className="empty">No groups found</div>;

  const isMember = (groupId) => joinedGroupsIds?.includes(groupId);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
            try {
                const res = await fetch(`https://api.notezone.in/api/jwt-decode`, {
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
            
              const noteuser = JSON.parse(localStorage.getItem("noteuser"));
              const [user_id, setuser_id] = useState(noteuser?.id);
            

  async function joinGroup(id) {
    const res = await fetch(`${API_BASE}/groups/${id}/join`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-user-id': user_id },
    });
    if (res.ok) {
      alert('Joined group!');
      window.location.reload(); 
    } else {
      const json = await res.json();
      alert(json.error?.message || 'Failed to join');
    }
  }

  async function leaveGroup(id) {
    const res = await fetch(`${API_BASE}/groups/${id}/leave`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-user-id': user_id },
    });
    if (res.ok) {
      alert('Left group!');
      window.location.reload();
    } else {
      const json = await res.json();
      alert(json.error?.message || 'Failed to leave');
    }
  }

  return (

<div className="groups-list">
  {groups.map(g => {
    const member = joinedGroupsIds?.includes(g.id);
    return (
      <div key={g.id} className="group-card">
        <div className="group-icon"><FaUsers /></div>
        <div className="group-info" onClick={() => onOpen(g)}>
          <h3>{g.name}</h3>
          <p><strong></strong> {g.topic || '-'}</p>
          <p>{g.description}</p>
          <div className="meta"><FaRegCalendarAlt /> {new Date(g.created_at).toLocaleDateString()}</div>
        </div>
        {member ? (
          <button className="group-btn leave" onClick={() => leaveGroup(g.id)}>Leave</button>
        ) : (
          <button className="group-btn join" onClick={() => joinGroup(g.id)}>Join</button>
        )}
      </div>
    );
  })}
</div>

  );
}

export default GroupsList;