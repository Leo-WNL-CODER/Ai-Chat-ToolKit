window.AI_Chat_Core = {
  currentPlatform: null,
  
  themeObserver: null,

  applyTheme: (theme) => {
    if (!theme) return;
    
    // Disconnect old observer if it exists
    if (window.AI_Chat_Core.themeObserver) {
      window.AI_Chat_Core.themeObserver.disconnect();
    }

    const enforceTheme = () => {
      document.documentElement.classList.remove('light', 'dark', 'ai-toolkit-theme-light', 'ai-toolkit-theme-dark', 'ai-toolkit-theme-minimal');
      
      // Forcefully apply our exact theme
      document.documentElement.classList.add(`ai-toolkit-theme-${theme}`);
      
      // Override ChatGPT's fundamental base styling assumption
      if (theme === 'dark' || theme === 'minimal') {
        document.documentElement.classList.add('dark');
        document.documentElement.style.colorScheme = 'dark';
      } else {
        document.documentElement.classList.add('light');
        document.documentElement.style.colorScheme = 'light';
      }
    };

    enforceTheme();

    // Create an aggressive lock to prevent ChatGPT's native theme engine from reverting our changes
    window.AI_Chat_Core.themeObserver = new MutationObserver((mutations) => {
      let runEnforce = false;
      for (const m of mutations) {
        if (m.type === 'attributes' && m.attributeName === 'class') {
           runEnforce = true;
           break;
        }
      }
      if (runEnforce) {
        window.AI_Chat_Core.themeObserver.disconnect();
        enforceTheme();
        window.AI_Chat_Core.themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
      }
    });

    window.AI_Chat_Core.themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
  },

  injectPerMessageCollapse: () => {
    const platform = window.AI_Chat_Core.currentPlatform;
    if (!platform || !platform.injectCollapseButton) return;

    const prompts = platform.getPromptElements();
    const responses = platform.getResponseElements();

    prompts.forEach((promptEl, index) => {
      let targetResponse = null;
      let next = promptEl.nextElementSibling;
      while (next) {
        if (responses.includes(next) || next.querySelector('[data-message-author-role="assistant"]')) {
          targetResponse = responses.includes(next) ? next : next.querySelector('[data-message-author-role="assistant"]');
          break;
        }
        if (next.tagName === 'MESSAGE-CONTENT' || next.classList.contains('model-response-text')) {
          targetResponse = next;
          break;
        }
        next = next.nextElementSibling;
      }

      if (!targetResponse && responses[index]) {
        targetResponse = responses[index];
      }

      if (targetResponse) {
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
      chrome.storage.local.get(['theme'], (result) => {
        if (result.theme) {
          window.AI_Chat_Core.applyTheme(result.theme);
        }
      });

      chrome.storage.onChanged.addListener((changes, area) => {
        if (area === 'local' && changes.theme) {
          window.AI_Chat_Core.applyTheme(changes.theme.newValue);
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
