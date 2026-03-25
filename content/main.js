window.AI_Chat_Core = {
  currentPlatform: null,
  
  init: () => {
    const platforms = [
      window.AI_Chat_Platform.ChatGPT,
      window.AI_Chat_Platform.Claude,
      window.AI_Chat_Platform.Gemini
    ];
    
    for (const p of platforms) {
      if (p && p.isActive()) {
        window.AI_Chat_Core.currentPlatform = p;
        break;
      }
    }
    
    if (window.AI_Chat_Core.currentPlatform) {
      console.log("[AI Toolkit] Platform detected:", window.AI_Chat_Core.currentPlatform.name);
      
      // We inject the toolbar after a delay to ensure the page has loaded its React/Angular structures
      setTimeout(() => {
        if(window.AI_Chat_UI_Toolbar) {
          window.AI_Chat_UI_Toolbar.inject();
        }
        if(window.AI_Chat_UI_Highlighter) {
          window.AI_Chat_UI_Highlighter.init();
        }
      }, 2000);
      
      // Observe DOM mutations to re-apply classes/injections if necessary
      const observer = new MutationObserver((mutations) => {
         // Optionally track new messages
      });
      observer.observe(document.body, { childList: true, subtree: true });
    }
  }
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', window.AI_Chat_Core.init);
} else {
  window.AI_Chat_Core.init();
}
