import React, { useState } from 'react';
import '../styles/MessageEditor.css';

function MessageEditor({ role, framedMessages, onConfirm }) {
  const [selectedOption, setSelectedOption] = useState(1);
  const [editedMessage, setEditedMessage] = useState(
    framedMessages?.framed_message_suggestion_1 || ''
  );
  const [isEditing, setIsEditing] = useState(false);

  const handleOptionSelect = (optionNumber) => {
    setSelectedOption(optionNumber);
    const message = optionNumber === 1 
      ? framedMessages?.framed_message_suggestion_1 
      : framedMessages?.framed_message_suggestion_2;
    setEditedMessage(message || '');
    setIsEditing(false);
  };

  const handleConfirm = () => {
    onConfirm(editedMessage, selectedOption);
  };

  const otherRole = role === 'father' ? 'son' : 'father';

  return (
    <div className="message-editor-container">
      <div className="message-editor-card">
        <div className="editor-header">
          <h2>Review Your Message</h2>
          <p className="editor-subtitle">
            Choose a message to send to your {otherRole}, or edit it to make it your own
          </p>
        </div>

        <div className="message-options">
          <div 
            className={`message-option ${selectedOption === 1 ? 'selected' : ''}`}
            onClick={() => handleOptionSelect(1)}
          >
            <div className="option-header">
              <input 
                type="radio" 
                checked={selectedOption === 1}
                onChange={() => handleOptionSelect(1)}
              />
              <span className="option-label">Option 1</span>
            </div>
            <p className="option-text">{framedMessages?.framed_message_suggestion_1}</p>
          </div>

          <div 
            className={`message-option ${selectedOption === 2 ? 'selected' : ''}`}
            onClick={() => handleOptionSelect(2)}
          >
            <div className="option-header">
              <input 
                type="radio" 
                checked={selectedOption === 2}
                onChange={() => handleOptionSelect(2)}
              />
              <span className="option-label">Option 2</span>
            </div>
            <p className="option-text">{framedMessages?.framed_message_suggestion_2}</p>
          </div>
        </div>

        <div className="edit-section">
          <div className="edit-header">
            <h3>Your Message</h3>
            <button 
              className="edit-toggle-button"
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? '✓ Done Editing' : '✏️ Edit Message'}
            </button>
          </div>

          {isEditing ? (
            <textarea
              className="message-textarea"
              value={editedMessage}
              onChange={(e) => setEditedMessage(e.target.value)}
              rows="6"
              placeholder="Edit your message here..."
            />
          ) : (
            <div className="message-preview">
              <p>{editedMessage}</p>
            </div>
          )}
        </div>

        <div className="editor-actions">
          <button 
            className="confirm-button"
            onClick={handleConfirm}
            disabled={!editedMessage.trim()}
          >
            Send to {otherRole.charAt(0).toUpperCase() + otherRole.slice(1)}
          </button>
        </div>
      </div>
    </div>
  );
}

export default MessageEditor;
