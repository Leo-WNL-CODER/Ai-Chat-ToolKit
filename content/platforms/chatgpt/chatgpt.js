window.AI_Chat_Platform = window.AI_Chat_Platform || {};

window.AI_Chat_Platform.ChatGPT = {
  name: 'chatgpt',
  domain: 'chatgpt.com',

  getPromptElements: () => {
    return Array.from(document.querySelectorAll('[data-message-author-role="user"], [data-testid^="conversation-turn"] .whitespace-pre-wrap, .font-user, [data-is-user="true"]'));
  },

  injectCollapseButton: (promptEl, responseEl) => {
    // Target the most robust parent container possible
    const turnWrapper = promptEl.closest('article') || promptEl.closest('[data-testid^="conversation-turn"]') || promptEl.parentElement;

    if (turnWrapper.querySelector('.ai-toolkit-single-collapse-btn')) return; // Already injected
    
    // Search the wrapper for designated action bars
    let actionBar = turnWrapper.querySelector('div[aria-label="Your message actions"], div[role="group"]');
    
    // Deep fallback: Look for known utility icons
    if (!actionBar) {
      const copyBtn = turnWrapper.querySelector('[data-testid="copy-turn-action-button"]');
      if (copyBtn) actionBar = copyBtn.parentElement;
    }

    // Bulletproof Fallback: If ChatGPT aggressively hid the action bar entirely or disabled it, overlay it on the prompt
    let isForcedAbsolute = false;
    if (!actionBar) {
      actionBar = promptEl;
      promptEl.style.position = promptEl.style.position || 'relative';
      isForcedAbsolute = true;
    }

    // Build the button directly using ChatGPT's precise classes for perfect responsive fitting
    const btn = document.createElement('button');
    btn.className = 'ai-toolkit-single-collapse-btn text-token-text-secondary hover:bg-token-bg-secondary rounded-lg';
    
    // Provide explicit inline CSS so it cannot overlap and mirrors ChatGPT flex children
    btn.style.display = 'flex';
    btn.style.alignItems = 'center';
    btn.style.justifyContent = 'center';
    btn.style.width = '32px';
    btn.style.height = '32px';
    btn.style.cursor = 'pointer';
    btn.style.border = 'none';
    btn.style.background = 'transparent';
    
    if (isForcedAbsolute) {
      btn.style.position = 'absolute';
      btn.style.bottom = '-40px';
      btn.style.right = '12px';
      btn.style.zIndex = '100';
      btn.style.backgroundColor = 'rgba(255,255,255,0.8)';
      btn.style.backdropFilter = 'blur(8px)';
      btn.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
    } else {
      btn.style.marginLeft = '4px';
    }

    btn.setAttribute('data-tooltip', 'Collapse AI Response');
    btn.innerHTML = `<span class="flex items-center justify-center h-8 w-8"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="18" height="18" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"></path></svg></span>`;

    actionBar.appendChild(btn);

    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      e.preventDefault();

      const isHidden = window.getComputedStyle(responseEl).display === 'none';
      responseEl.classList.remove('ai-toolkit-response-hidden', 'ai-toolkit-response-expanded');

      if (isHidden) {
        responseEl.classList.add('ai-toolkit-response-expanded');
        btn.innerHTML = `<span class="flex items-center justify-center h-8 w-8"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="18" height="18" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"></path></svg></span>`;
        btn.setAttribute('data-tooltip', 'Collapse AI Response');
        btn.classList.remove('collapsed');
      } else {
        responseEl.classList.add('ai-toolkit-response-hidden');
        btn.innerHTML = `<span class="flex items-center justify-center h-8 w-8"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="18" height="18" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5 15l7-7 7 7"></path></svg></span>`;
        btn.setAttribute('data-tooltip', 'Expand AI Response');
        btn.classList.add('collapsed');
      }
    });
  },

  getResponseElements: () => {
    return Array.from(document.querySelectorAll('[data-message-author-role="assistant"], .markdown.prose, .result-streaming, .model-response-text, [data-is-user="false"]'));
  },

  isActive: () => {
    return window.location.hostname.includes('chatgpt.com') || window.location.hostname.includes('chat.openai.com');
  }
};
