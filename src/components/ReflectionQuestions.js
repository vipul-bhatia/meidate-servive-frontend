import React, { useState, useEffect, useRef } from 'react';
import { conflictAPI } from '../services/api';
import '../styles/ReflectionQuestions.css';

function ReflectionQuestions({ 
  role, 
  isInitiator,
  actualInitiator, // The person who actually started the conflict
  conflictTitle, 
  emotion, 
  framedMessage,
  conversationState,
  onComplete 
}) {
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [questionCount, setQuestionCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [framedMessages, setFramedMessages] = useState(null);
  const chatContainerRef = useRef(null);

  const MAX_QUESTIONS = 3;

  useEffect(() => {
    // Load initial question
    loadInitialQuestion();
  }, []);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory, currentQuestion]);

  const loadInitialQuestion = async () => {
    setLoading(true);
    try {
      let result;
      
      if (isInitiator) {
        // For initiator, use the regular reflection endpoint
        result = await conflictAPI.getInitialReflection(
          actualInitiator,
          conflictTitle,
          emotion,
          {
            conversation_state: conversationState,
            chat_history: []
          }
        );
        
        // Parse the question if it's JSON
        let questionText = result.initial_reflection_question;
        try {
          const parsed = JSON.parse(questionText);
          questionText = parsed.question;
        } catch (e) {
          // If not JSON, use as is
        }
        
        setCurrentQuestion(questionText);
      } else {
        // For non-initiator, use the non-initiator reflection endpoint
        result = await conflictAPI.getNonInitiatorReflection(
          actualInitiator,
          conflictTitle,
          framedMessage,
          {
            conversation_state: conversationState,
            chat_history: []
          }
        );
        
        setCurrentQuestion(result.next_question);
      }
      
      setQuestionCount(1);
    } catch (error) {
      console.error('Error loading initial question:', error);
      setCurrentQuestion('Can you tell me more about what happened?');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitAnswer = async () => {
    if (!answer.trim()) return;

    const newHistory = [
      ...chatHistory,
      { role: 'ai', content: currentQuestion, timestamp: Math.floor(Date.now() / 1000) },
      { role: 'user', content: answer, timestamp: Math.floor(Date.now() / 1000) }
    ];
    setChatHistory(newHistory);
    setAnswer('');

    if (questionCount >= MAX_QUESTIONS) {
      // Complete reflection phase - get framed messages for both parties
      await getFramedMessages(newHistory);
      return;
    }

    // Get next question
    setLoading(true);
    try {
      let result;
      
      if (isInitiator) {
        // For initiator, use regular follow-up endpoint
        result = await conflictAPI.getFollowUpQuestion(
          actualInitiator,
          {
            conversation_state: {
              ...conversationState,
              questions_asked: questionCount,
              timestamp: Math.floor(Date.now() / 1000)
            },
            chat_history: newHistory
          }
        );

        let nextQuestion = result.next_question;
        try {
          const parsed = JSON.parse(nextQuestion);
          nextQuestion = parsed.question;
        } catch (e) {
          // If not JSON, use as is
        }

        setCurrentQuestion(nextQuestion);
      } else {
        // For non-initiator, use non-initiator reflection endpoint
        result = await conflictAPI.getNonInitiatorReflection(
          actualInitiator,
          conflictTitle,
          framedMessage,
          {
            conversation_state: {
              ...conversationState,
              questions_asked: questionCount,
              timestamp: Math.floor(Date.now() / 1000)
            },
            chat_history: newHistory
          }
        );

        setCurrentQuestion(result.next_question);
      }
      
      setQuestionCount(questionCount + 1);
    } catch (error) {
      console.error('Error loading follow-up question:', error);
    } finally {
      setLoading(false);
    }
  };

  const getFramedMessages = async (history) => {
    setLoading(true);
    try {
      const result = await conflictAPI.getFramedMessages(
        role,
        conflictTitle,
        {
          conversation_state: {
            ...conversationState,
            questions_asked: MAX_QUESTIONS,
            timestamp: Math.floor(Date.now() / 1000)
          },
          chat_history: history
        }
      );
      setFramedMessages(result);
      onComplete(history, result);
    } catch (error) {
      console.error('Error getting framed messages:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reflection-container">
      <div className="reflection-card">
        <div className="reflection-header">
          <h2>{isInitiator ? 'Reflection Time' : `Message from ${role === 'father' ? 'Son' : 'Father'}`}</h2>
          <div className="progress-indicator">
            Question {questionCount} of {MAX_QUESTIONS}
          </div>
        </div>

        {!isInitiator && framedMessage && (
          <div className="framed-message-box">
            <p className="framed-message">{framedMessage}</p>
          </div>
        )}

        <div className="chat-container" ref={chatContainerRef}>
          {chatHistory.map((msg, index) => (
            <div 
              key={index} 
              className={`message ${msg.role === 'ai' ? 'ai-message' : 'user-message'}`}
            >
              <div className="message-content">{msg.content}</div>
            </div>
          ))}

          {currentQuestion && (
            <div className="message ai-message current-question">
              <div className="message-content">{currentQuestion}</div>
            </div>
          )}
        </div>

        <div className="answer-section">
          <textarea
            className="answer-input"
            placeholder="Type your response here..."
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmitAnswer();
              }
            }}
            rows="3"
          />
          <button 
            className="send-button"
            onClick={handleSubmitAnswer}
            disabled={loading || !answer.trim()}
          >
            {loading ? '...' : questionCount >= MAX_QUESTIONS ? 'Complete' : 'Send'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ReflectionQuestions;
