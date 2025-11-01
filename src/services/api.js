import axios from 'axios';

const API_BASE_URL = 'https://d3g3izlps2bbpv.cloudfront.net/api/conflict';

export const conflictAPI = {
  // Step 1: Topic Selection
  selectTopic: async (sessionInitiator, userTopic, emotion) => {
    const response = await axios.post(`${API_BASE_URL}/topic-selection`, {
      session_initiator: sessionInitiator,
      user_topic: userTopic,
      emotion: emotion
    });
    return response.data;
  },

  // Step 2: Initial Reflection Question
  getInitialReflection: async (initiator, topic, emotion, chatJson) => {
    const response = await axios.post(`${API_BASE_URL}/reflection-question/initial`, {
      initiator,
      topic,
      emotion,
      chat_json: chatJson
    });
    return response.data;
  },

  // Step 3: Follow-up Question
  getFollowUpQuestion: async (initiator, chatJson) => {
    const response = await axios.post(`${API_BASE_URL}/reflection-question/follow-up`, {
      initiator,
      chat_json: chatJson
    });
    return response.data;
  },

  // Step 3b: Non-initiator Reflection Question
  getNonInitiatorReflection: async (initiator, topic, framedMessage, chatJson) => {
    const response = await axios.post(`${API_BASE_URL}/non-initiator-reflection`, {
      initiator,
      topic,
      framed_message: framedMessage,
      chat_json: chatJson
    });
    return response.data;
  },

  // Step 4: Framing
  getFramedMessages: async (initiator, topic, chatJson) => {
    const response = await axios.post(`${API_BASE_URL}/framing`, {
      initiator,
      topic,
      chat_json: chatJson
    });
    return response.data;
  },

  // Step 5: Resolution Suggestions
  getResolutionSuggestions: async (initiator, topic, initiatorChatJson, nonInitiatorChatJson, forRole) => {
    const response = await axios.post(`${API_BASE_URL}/resolution-suggestions`, {
      initiator,
      topic,
      initiator_chat_json: initiatorChatJson,
      non_initiator_chat_json: nonInitiatorChatJson,
      for_role: forRole
    });
    return response.data;
  }
};
