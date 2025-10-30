// import React, { useEffect, useState } from "react";
// import BASE_URL from "../Services/Base_URL.jsx";
// import './c.css'
// const Community = () => {

//     const [user, setUser] = useState(null);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         const fetchUser = async () => {
//             try {
//                 const res = await fetch(`${BASE_URL}/decode`, {
//                     method: "GET",
//                     credentials: "include",
//                 });

//                 const data = await res.json();

//                 if (res.ok && data.noteuser) {
//                     setUser(data.noteuser);
//                     localStorage.setItem("noteuser", JSON.stringify(data.noteuser));
//                 } 
//             } catch (err) {
//                 console.error(err);
//                 setTimeout(() => {
//                     localStorage.removeItem("noteuser");
//                     window.location.href = "https://notezone.in/login";
//                 }, 1000000);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchUser();
//     }, []);
//     return (
//         <div>Community <br />
//             Welcome{" "}
//             {loading ? (
//                 <span className="loader"></span>
//             ) : (
//                 <span>{user?.name}</span>
//             )}
//         </div>

//     )
// }

// export default Community

import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import CreateGroup from './CreateGroup';
import GroupsList from './GroupsList';
import ChatPanel from './ChatPanel';
import './community.css';
import './c.css'

import BASE_URL from "../Services/Base_URL.jsx";
const API_BASE = BASE_URL;

const Community=()=> {
  const [view, setView] = useState('all');
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [joinedGroups, setJoinedGroups] = useState([]);
  const [allGroups, setAllGroups] = useState([]);
  const [refresh, setRefresh] = useState(0);

  const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

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

async function fetchJoinedGroups() {
  if (!user_id) return;

  const res = await fetch(`${API_BASE}/my-groups`, {
    headers: { 'x-user-id': user_id }
  });

  if (!res.ok) {
    console.error('Failed to fetch joined groups');
    setJoinedGroups([]);
    return;
  }

  const json = await res.json();
  setJoinedGroups(json.groups || []);
}

  function onGroupCreated() {
    setRefresh(r => r + 1);
    setView('all');
  }
  function handleJoin(groupId) {
  const group = allGroups.find(g => g.id === groupId);
  if (!group) return;
  setJoinedGroups(prev => [...prev, group]);
}

function handleLeave(groupId) {
  setJoinedGroups(prev => prev.filter(g => g.id !== groupId));
}


  return (
    <div className="community-root">
      <Sidebar view={view} setView={setView} />
      <main className="community-main">
        {view === 'create' && <CreateGroup onCreated={onGroupCreated} apiBase={API_BASE} />}
        {view === 'all' && (
<GroupsList
  groups={allGroups}
  onOpen={(g) => setSelectedGroup(g)}
  apiBase={API_BASE}
  joinedGroupsIds={joinedGroups.map(g => g.id)}
  onJoin={handleJoin}
  onLeave={handleLeave}
/>
        )}
        {view === 'joined' && (
  <GroupsList
    groups={joinedGroups}  
    onOpen={(g) => setSelectedGroup(g)}
    apiBase={API_BASE}
    joinedGroupsIds={joinedGroups.map(g => g.id)}
    onJoin={handleJoin}
    onLeave={handleLeave}
  />
        )}
      </main>

      <aside className="community-chat">
        {selectedGroup ? (
          <ChatPanel
            group={selectedGroup}
            onClose={() => setSelectedGroup(null)}
            apiBase={API_BASE}
          />
        ) : (
          <div className="chat-placeholder">Select a group to open chat</div>
        )}
      </aside>
    </div>
  );
}
export default Community;