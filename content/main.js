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
          while(next) {
            if (responses.includes(next) || next.querySelector('[data-message-author-role="assistant"]')) {
               targetResponse = responses.includes(next) ? next : next.querySelector('[data-message-author-role="assistant"]');
               break;
            }
            if (next.tagName === 'MESSAGE-CONTENT' || next.classList.contains('model-response-text') || next.querySelector('message-content, .model-response-text')) {
               targetResponse = (next.tagName === 'MESSAGE-CONTENT' || next.classList.contains('model-response-text')) ? next : next.querySelector('message-content, .model-response-text');
               break;
            }
            next = next.nextElementSibling;
          }

          if (!targetResponse) {
            let parent = promptEl.parentElement;
            while (parent && parent.tagName !== 'BODY' && !targetResponse) {
               let sibling = parent.nextElementSibling;
               while(sibling) {
                 if (responses.includes(sibling) || sibling.querySelector('message-content, [data-message-author-role="assistant"]')) {
                   targetResponse = responses.includes(sibling) ? sibling : sibling.querySelector('message-content, [data-message-author-role="assistant"]');
                   break;
                 }
                 sibling = sibling.nextElementSibling;
               }
               parent = parent.parentElement;
            }
          }

          if (!targetResponse && responses[index]) {
            targetResponse = responses[index];
          }
      }

      // TAG AND INJECT
      if (targetResponse) {
        targetResponse = targetResponse.closest('.response-container') || targetResponse;

        targetResponse.classList.add('ai-toolkit-assistant-wrapper');
        platform.injectCollapseButton(promptEl, targetResponse);
      }
    });
  },

  init: () => {
    const platforms = [
      window.AI_Chat_Platform.ChatGPT,
      window.AI_Chat_Platform.Gemini
    ];
    
    for (const p of platforms) {
      if (p && p.isActive()) {
        window.AI_Chat_Core.currentPlatform = p;
        break;
      }
    }
    
    if (window.AI_Chat_Core.currentPlatform) {
      chrome.storage.local.get(['theme'], (result) => {
        if (result.theme) document.documentElement.classList.add(`ai-toolkit-theme-${result.theme}`);
      });
      chrome.storage.onChanged.addListener((changes, area) => {
        if (area === 'local' && changes.theme) {
          document.documentElement.classList.remove('ai-toolkit-theme-light', 'ai-toolkit-theme-dark', 'ai-toolkit-theme-minimal');
          document.documentElement.classList.add(`ai-toolkit-theme-${changes.theme.newValue}`);
        }
      });

      setTimeout(() => {
        if(window.AI_Chat_UI_Toolbar) {
          window.AI_Chat_UI_Toolbar.inject();
        }
        if(window.AI_Chat_UI_Highlighter) {
          window.AI_Chat_UI_Highlighter.init();
        }
        window.AI_Chat_Core.injectPerMessageCollapse();
      }, 2000);

      // Use MutationObserver to detect new AI responses instead of polling
      let collapseDebounceTimer = null;
      const observer = new MutationObserver(() => {
        clearTimeout(collapseDebounceTimer);
        collapseDebounceTimer = setTimeout(() => {
          window.AI_Chat_Core.injectPerMessageCollapse();
        }, 500);
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
