import React, { useState } from 'react';
import { conflictAPI } from '../services/api';
import '../styles/ConflictInput.css';

function ConflictInput({ initiator, onSubmit }) {
  const [conflictText, setConflictText] = useState('');
  const [emotion, setEmotion] = useState('frustration');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const emotions = [
    { value: 'frustration', label: 'Frustrated 😤', color: '#ff6b6b' },
    { value: 'anger', label: 'Angry 😠', color: '#ff4757' },
    { value: 'sadness', label: 'Sad 😢', color: '#5f85db' },
    { value: 'confusion', label: 'Confused 😕', color: '#ffa502' },
    { value: 'disappointment', label: 'Disappointed 😞', color: '#95a5a6' },
    { value: 'hurt', label: 'Hurt 💔', color: '#e056fd' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!conflictText.trim()) {
      setError('Please describe what happened');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await conflictAPI.selectTopic(initiator, conflictText, emotion);
      onSubmit(result);
    } catch (err) {
      setError('Failed to submit conflict. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="conflict-input-container">
      <div className="conflict-input-card">
        <h2 className="conflict-title">Share What Happened</h2>
        <p className="conflict-subtitle">
          Take a moment to describe the situation that's bothering you
        </p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="conflict-text">What happened?</label>
            <textarea
              id="conflict-text"
              className="conflict-textarea"
              placeholder="Example: He cut me off while I was speaking..."
              value={conflictText}
              onChange={(e) => setConflictText(e.target.value)}
              rows="5"
            />
          </div>

          <div className="form-group">
            <label>How are you feeling?</label>
            <div className="emotion-grid">
              {emotions.map((emo) => (
                <button
                  key={emo.value}
                  type="button"
                  className={`emotion-button ${emotion === emo.value ? 'selected' : ''}`}
                  style={{ 
                    borderColor: emotion === emo.value ? emo.color : '#e0e0e0',
                    backgroundColor: emotion === emo.value ? `${emo.color}15` : 'white'
                  }}
                  onClick={() => setEmotion(emo.value)}
                >
                  {emo.label}
                </button>
              ))}
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}

          <button 
            type="submit" 
            className="submit-button"
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Continue'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ConflictInput;
