window.AI_Chat_Platform = window.AI_Chat_Platform || {};

window.AI_Chat_Platform.Claude = {
  name: 'claude',
  domain: 'claude.ai',
  
  getPromptElements: () => {
    return Array.from(document.querySelectorAll('.font-user, [data-is-user="true"]')).filter(el => el.textContent.trim().length > 0);
  },
  
  getResponseElements: () => {
    return Array.from(document.querySelectorAll('.font-claude, [data-is-user="false"]'));
  },

  isActive: () => {
    return window.location.hostname.includes('claude.ai');
  }
};
