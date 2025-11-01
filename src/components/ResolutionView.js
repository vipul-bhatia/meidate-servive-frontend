import React, { useState, useEffect } from 'react';
import { conflictAPI } from '../services/api';
import '../styles/ResolutionView.css';

function ResolutionView({ 
  initiator, 
  nonInitiator, 
  conflictTitle,
  initiatorChatHistory, 
  nonInitiatorChatHistory,
  initiatorFramedMessages,
  nonInitiatorFramedMessages,
  initiatorFinalMessage,
  nonInitiatorFinalMessage
}) {
  const [initiatorSuggestions, setInitiatorSuggestions] = useState(null);
  const [nonInitiatorSuggestions, setNonInitiatorSuggestions] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState('both'); // 'both', 'father', 'son'

  useEffect(() => {
    loadResolutionSuggestions();
  }, []);

  const loadResolutionSuggestions = async () => {
    setLoading(true);
    try {
      // Prepare chat JSON structures
      const initiatorChatJson = {
        conversation_state: {
          phase: 'needs_identification',
          questions_asked: initiatorChatHistory.length,
          emotions_identified: initiatorFramedMessages?.metadata?.all_emotions || [],
          topics_mentioned: [conflictTitle],
          timestamp: Math.floor(Date.now() / 1000)
        },
        chat_history: initiatorChatHistory
      };

      const nonInitiatorChatJson = {
        conversation_state: {
          phase: 'needs_identification',
          questions_asked: nonInitiatorChatHistory.length,
          emotions_identified: nonInitiatorFramedMessages?.metadata?.all_emotions || [],
          topics_mentioned: [conflictTitle],
          timestamp: Math.floor(Date.now() / 1000)
        },
        chat_history: nonInitiatorChatHistory
      };

      console.log('Loading suggestions for:', { initiator, nonInitiator, conflictTitle });

      // Get suggestions for both parties
      const [initSuggestions, nonInitSuggestions] = await Promise.all([
        conflictAPI.getResolutionSuggestions(
          initiator,
          conflictTitle,
          initiatorChatJson,
          nonInitiatorChatJson,
          initiator
        ),
        conflictAPI.getResolutionSuggestions(
          initiator,
          conflictTitle,
          initiatorChatJson,
          nonInitiatorChatJson,
          nonInitiator
        )
      ]);

      console.log('Suggestions loaded:', { initSuggestions, nonInitSuggestions });

      setInitiatorSuggestions(initSuggestions);
      setNonInitiatorSuggestions(nonInitSuggestions);
    } catch (error) {
      console.error('Error loading resolution suggestions:', error);
      console.error('Error details:', error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  const renderPerspective = (role, isInitiatorRole, suggestions) => {
    // Get the framed messages for this role
    const framedMessagesForRole = isInitiatorRole ? initiatorFramedMessages : nonInitiatorFramedMessages;
    const framedMessage = framedMessagesForRole?.framed_message_suggestion_1;
    
    console.log(`Rendering ${role}:`, { isInitiatorRole, suggestions: suggestions?.suggestions });
    
    return (
      <div className="perspective-card">
        <div className="perspective-header">
          <div className="role-badge">{role === 'father' ? '👨 Father' : '👦 Son'}</div>
          <h3>{role === initiator ? "Your" : "Their"} Perspective</h3>
        </div>

        <div className="perspective-summary">
          <h4>Constructive Message:</h4>
          <div className="framed-message-display">
            <p>{framedMessage || 'Message being processed...'}</p>
          </div>
        </div>

        {suggestions && suggestions.suggestions && suggestions.suggestions.length > 0 ? (
          <div className="suggestions-section">
            <h4>💡 Suggestions for {role === initiator ? 'You' : role}:</h4>
            <div className="suggestions-list">
              {suggestions.suggestions.map((suggestion, index) => (
                <div key={index} className="suggestion-card">
                  <div className="suggestion-header">
                    <span className="suggestion-number">{suggestion.number}</span>
                    <h5>{suggestion.title}</h5>
                  </div>
                  <p className="suggestion-explanation">{suggestion.explanation}</p>
                  <div className="first-step">
                    <strong>First Step:</strong> {suggestion.first_step}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="suggestions-section">
            <h4>💡 Loading suggestions...</h4>
            <p style={{ color: '#666', fontStyle: 'italic' }}>Generating personalized suggestions for {role}...</p>
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="resolution-loading">
        <div className="loading-spinner"></div>
        <p>Generating personalized resolution suggestions...</p>
      </div>
    );
  }

  return (
    <div className="resolution-view-container">
      <div className="resolution-header">
        <h1>🤝 Resolution Pathway</h1>
        <p className="resolution-subtitle">
          Here's what both of you shared, along with personalized suggestions for moving forward
        </p>
      </div>

      <div className="view-toggle">
        <button 
          className={`toggle-btn ${activeView === 'both' ? 'active' : ''}`}
          onClick={() => setActiveView('both')}
        >
          Both Perspectives
        </button>
        <button 
          className={`toggle-btn ${activeView === 'father' ? 'active' : ''}`}
          onClick={() => setActiveView('father')}
        >
          👨 Father
        </button>
        <button 
          className={`toggle-btn ${activeView === 'son' ? 'active' : ''}`}
          onClick={() => setActiveView('son')}
        >
          👦 Son
        </button>
      </div>

      <div className={`perspectives-container ${activeView}`}>
        {(activeView === 'both' || activeView === 'father') && (
          renderPerspective(
            'father',
            initiator === 'father',
            initiator === 'father' ? initiatorSuggestions : nonInitiatorSuggestions
          )
        )}

        {(activeView === 'both' || activeView === 'son') && (
          renderPerspective(
            'son',
            initiator === 'son',
            initiator === 'son' ? initiatorSuggestions : nonInitiatorSuggestions
          )
        )}
      </div>

      <div className="resolution-footer">
        <div className="reminder-box">
          <h4>💭 Remember</h4>
          <ul>
            <li>Both perspectives are valid and important</li>
            <li>Take time to understand each other's feelings</li>
            <li>Small steps forward are still progress</li>
            <li>This is a journey you're taking together</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default ResolutionView;
