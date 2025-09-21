// TopBar component with brand title and user info
import React from 'react';

const TopBar: React.FC = () => {
  return (
    <header className="topbar">
      <div className="brand">
        <h1 className="title">Orders</h1>
      </div>
    <div className="topbar-right">
        <div className="logo-circle">KA</div>
        <button className="logout-btn">Logout</button>
    </div>
    </header>
  );
};

export default TopBar;
