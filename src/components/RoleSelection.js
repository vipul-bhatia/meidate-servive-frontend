import React from 'react';
import '../styles/RoleSelection.css';

function RoleSelection({ onRoleSelected }) {
  return (
    <div className="role-selection-container">
      <div className="role-selection-card">
        <h1 className="title">Conflict Resolution</h1>
        <p className="subtitle">Who would like to start the conversation?</p>
        
        <div className="role-buttons">
          <button 
            className="role-button father-button"
            onClick={() => onRoleSelected('father')}
          >
            <div className="role-icon">👨</div>
            <span className="role-label">Father</span>
          </button>

          <button 
            className="role-button son-button"
            onClick={() => onRoleSelected('son')}
          >
            <div className="role-icon">👦</div>
            <span className="role-label">Son</span>
          </button>
        </div>

        <p className="help-text">
          Choose your role to begin the conflict resolution process
        </p>
      </div>
    </div>
  );
}

export default RoleSelection;
