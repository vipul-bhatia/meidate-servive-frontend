import React, { useState } from 'react';
import '../styles/WaitingRoom.css';

function WaitingRoom({ initiator, nonInitiator, finalMessage, onOtherPartyJoined }) {
  const [showMessage, setShowMessage] = useState(false);

  return (
    <div className="waiting-room-container">
      <div className="waiting-room-card">
        <div className="waiting-icon">
          <div className="pulse-circle"></div>
          <span className="waiting-emoji">⏳</span>
        </div>
        
        <h2 className="waiting-title">Message Sent!</h2>
        <p className="waiting-subtitle">
          Waiting for {nonInitiator} to join the conversation...
        </p>

        <div className="message-preview-section">
          <button 
            className="preview-toggle-button"
            onClick={() => setShowMessage(!showMessage)}
          >
            {showMessage ? 'Hide' : 'Preview'} Your Message
          </button>

          {showMessage && finalMessage && (
            <div className="message-preview-box">
              <h3>Your Message</h3>
              
              <div className="message-option">
                <p>{finalMessage}</p>
              </div>
            </div>
          )}
        </div>

        <div className="simulate-section">
          <p className="simulate-note">For demo purposes:</p>
          <button 
            className="simulate-button"
            onClick={onOtherPartyJoined}
          >
            Simulate {nonInitiator} Joining
          </button>
        </div>
      </div>
    </div>
  );
}

export default WaitingRoom;
