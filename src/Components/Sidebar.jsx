import React from 'react';

const Sidebar=({ view, setView })=> {
  return (
    <aside className="community-sidebar">
      <div className="brand">
      <div className="nz-logo"></div>
      <div className="divider"></div>
      <h1 className="community-title">
        Community
      </h1>
      </div>
      <nav>
        <button className={view === 'create' ? 'active' : ''} onClick={() => setView('create')}>Create Group</button>
        <button className={view === 'joined' ? 'active' : ''} onClick={() => setView('joined')}>Joined Groups</button>
        <button className={view === 'all' ? 'active' : ''} onClick={() => setView('all')}>All Groups</button>
      </nav>
    </aside>
  );
}
export default Sidebar;