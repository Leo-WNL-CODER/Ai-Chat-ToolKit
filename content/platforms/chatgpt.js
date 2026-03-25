window.AI_Chat_Platform = window.AI_Chat_Platform || {};

window.AI_Chat_Platform.ChatGPT = {
  name: 'chatgpt',
  domain: 'chatgpt.com',
  
  getPromptElements: () => {
    return Array.from(document.querySelectorAll('[data-message-author-role="user"]'));
  },
  
  getResponseElements: () => {
    return Array.from(document.querySelectorAll('[data-message-author-role="assistant"]'));
  },

  isActive: () => {
    return window.location.hostname.includes('chatgpt.com');
  }
};
