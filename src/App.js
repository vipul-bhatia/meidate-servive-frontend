import React, { useState } from 'react';
import './styles/App.css';
import RoleSelection from './components/RoleSelection';
import ConflictInput from './components/ConflictInput';
import ReflectionQuestions from './components/ReflectionQuestions';
import MessageEditor from './components/MessageEditor';
import WaitingRoom from './components/WaitingRoom';
import ResolutionView from './components/ResolutionView';

function App() {
  const [currentStep, setCurrentStep] = useState('role-selection');
  const [sessionData, setSessionData] = useState({
    initiator: null,
    nonInitiator: null,
    conflictTitle: '',
    emotion: '',
    initiatorChatHistory: [],
    nonInitiatorChatHistory: [],
    initiatorFramedMessages: null,
    nonInitiatorFramedMessages: null,
    initiatorFinalMessage: null,
    nonInitiatorFinalMessage: null,
    conversationState: null
  });

  const handleRoleSelected = (role) => {
    const otherRole = role === 'father' ? 'son' : 'father';
    setSessionData({
      ...sessionData,
      initiator: role,
      nonInitiator: otherRole
    });
    setCurrentStep('conflict-input');
  };

  const handleConflictSubmitted = (conflictData) => {
    setSessionData({
      ...sessionData,
      conflictTitle: conflictData.conflict_title,
      emotion: conflictData.emotion,
      conversationState: {
        phase: 'initial_reflection',
        questions_asked: 0,
        emotions_identified: [conflictData.emotion],
        topics_mentioned: [conflictData.conflict_title],
        timestamp: Math.floor(Date.now() / 1000)
      }
    });
    setCurrentStep('initiator-reflection');
  };

  const handleInitiatorReflectionComplete = (chatHistory, framedMessages) => {
    setSessionData({
      ...sessionData,
      initiatorChatHistory: chatHistory,
      initiatorFramedMessages: framedMessages
    });
    setCurrentStep('initiator-message-editor');
  };

  const handleInitiatorMessageConfirmed = (finalMessage) => {
    setSessionData({
      ...sessionData,
      initiatorFinalMessage: finalMessage
    });
    setCurrentStep('waiting-for-other');
  };

  const handleOtherPartyJoined = () => {
    setCurrentStep('non-initiator-reflection');
  };

  const handleNonInitiatorReflectionComplete = (chatHistory, framedMessages) => {
    setSessionData({
      ...sessionData,
      nonInitiatorChatHistory: chatHistory,
      nonInitiatorFramedMessages: framedMessages
    });
    setCurrentStep('non-initiator-message-editor');
  };

  const handleNonInitiatorMessageConfirmed = (finalMessage) => {
    setSessionData({
      ...sessionData,
      nonInitiatorFinalMessage: finalMessage
    });
    setCurrentStep('resolution');
  };

  return (
    <div className="app-container">
      {currentStep === 'role-selection' && (
        <RoleSelection onRoleSelected={handleRoleSelected} />
      )}

      {currentStep === 'conflict-input' && (
        <ConflictInput
          initiator={sessionData.initiator}
          onSubmit={handleConflictSubmitted}
        />
      )}

      {currentStep === 'initiator-reflection' && (
        <ReflectionQuestions
          role={sessionData.initiator}
          isInitiator={true}
          actualInitiator={sessionData.initiator}
          conflictTitle={sessionData.conflictTitle}
          emotion={sessionData.emotion}
          conversationState={sessionData.conversationState}
          onComplete={handleInitiatorReflectionComplete}
        />
      )}

      {currentStep === 'initiator-message-editor' && (
        <MessageEditor
          role={sessionData.initiator}
          framedMessages={sessionData.initiatorFramedMessages}
          onConfirm={handleInitiatorMessageConfirmed}
        />
      )}

      {currentStep === 'waiting-for-other' && (
        <WaitingRoom
          initiator={sessionData.initiator}
          nonInitiator={sessionData.nonInitiator}
          finalMessage={sessionData.initiatorFinalMessage}
          onOtherPartyJoined={handleOtherPartyJoined}
        />
      )}

      {currentStep === 'non-initiator-reflection' && (
        <ReflectionQuestions
          role={sessionData.nonInitiator}
          isInitiator={false}
          actualInitiator={sessionData.initiator}
          conflictTitle={sessionData.conflictTitle}
          emotion={sessionData.emotion}
          framedMessage={sessionData.initiatorFinalMessage}
          conversationState={sessionData.conversationState}
          onComplete={handleNonInitiatorReflectionComplete}
        />
      )}

      {currentStep === 'non-initiator-message-editor' && (
        <MessageEditor
          role={sessionData.nonInitiator}
          framedMessages={sessionData.nonInitiatorFramedMessages}
          onConfirm={handleNonInitiatorMessageConfirmed}
        />
      )}

      {currentStep === 'resolution' && (
        <ResolutionView
          initiator={sessionData.initiator}
          nonInitiator={sessionData.nonInitiator}
          conflictTitle={sessionData.conflictTitle}
          initiatorChatHistory={sessionData.initiatorChatHistory}
          nonInitiatorChatHistory={sessionData.nonInitiatorChatHistory}
          initiatorFramedMessages={sessionData.initiatorFramedMessages}
          nonInitiatorFramedMessages={sessionData.nonInitiatorFramedMessages}
          initiatorFinalMessage={sessionData.initiatorFinalMessage}
          nonInitiatorFinalMessage={sessionData.nonInitiatorFinalMessage}
        />
      )}
    </div>
  );
}

export default App;
