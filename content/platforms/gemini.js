window.AI_Chat_Platform = window.AI_Chat_Platform || {};

window.AI_Chat_Platform.Gemini = {
  name: 'gemini',
  domain: 'gemini.google.com',
  
  getPromptElements: () => {
    // A broader selection for user prompts in Gemini
    return Array.from(document.querySelectorAll('user-query, .user-query-container, [data-message-author="user"]'));
  },
  
  getResponseElements: () => {
    return Array.from(document.querySelectorAll('message-content, .response-container, .model-response-text'));
  },

  isActive: () => {
    return window.location.hostname.includes('gemini.google.com');
  }
};
