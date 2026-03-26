window.AI_Chat_Core = {
  currentPlatform: null,

  injectPerMessageCollapse: () => {
    const platform = window.AI_Chat_Core.currentPlatform;
    if (!platform || !platform.injectCollapseButton) return;

    const prompts = platform.getPromptElements();
    const responses = platform.getResponseElements ? platform.getResponseElements() : [];

    prompts.forEach((promptEl, index) => {
      let targetResponse = null;

      // 1. NATIVE CHATGPT STRUCTURE: A user prompt sits inside an <article>, followed immediately by an assistant <article>
      const promptArticle = promptEl.closest('article') || promptEl.closest('[data-testid^="conversation-turn"]');
      if (promptArticle && promptArticle.nextElementSibling) {
        let sibling = promptArticle.nextElementSibling;
        
        // Ensure the sibling is actually an assistant response and not just another user prompt
        if (sibling && !sibling.querySelector('[data-message-author-role="user"]')) {
           targetResponse = sibling;
        }
      }

      // 2. FALLBACK TRAVERSAL: If ChatGPT changes structure, do a deep DOM walk
      if (!targetResponse) {
        let next = promptEl.nextElementSibling;
        while (next) {
          if (responses.includes(next) || next.querySelector('[data-message-author-role="assistant"]') || next.classList.contains('model-response-text')) {
            targetResponse = responses.includes(next) ? next : (next.querySelector('[data-message-author-role="assistant"]') || next);
            break;
          }
          next = next.nextElementSibling;
        }
      }

      // TAG AND INJECT
      if (targetResponse) {
        targetResponse.classList.add('ai-toolkit-assistant-wrapper');
        platform.injectCollapseButton(promptEl, targetResponse);
      }
    });
  },

  init: () => {
    const platforms = [
      window.AI_Chat_Platform.ChatGPT
    ];
    
    for (const p of platforms) {
      if (p && p.isActive()) {
        window.AI_Chat_Core.currentPlatform = p;
        break;
      }
    }
    
    if (window.AI_Chat_Core.currentPlatform) {
      setTimeout(() => {
        if(window.AI_Chat_UI_Toolbar) {
          window.AI_Chat_UI_Toolbar.inject();
        }
        if(window.AI_Chat_UI_Highlighter) {
          window.AI_Chat_UI_Highlighter.init();
        }
        window.AI_Chat_Core.injectPerMessageCollapse();
      }, 2000);

      setInterval(() => {
        window.AI_Chat_Core.injectPerMessageCollapse();
      }, 2000);
    }
  }
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', window.AI_Chat_Core.init);
} else {
  window.AI_Chat_Core.init();
}
