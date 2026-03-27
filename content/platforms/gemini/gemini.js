window.AI_Chat_Platform = window.AI_Chat_Platform || {};

window.AI_Chat_Platform.Gemini = {
  name: 'gemini',
  domain: 'gemini.google.com',

  getPromptElements: () => {
    return Array.from(document.querySelectorAll('user-query, .user-query-container'));
  },

  injectCollapseButton: (promptEl, responseEl) => {
    let queryContent = promptEl.classList.contains('query-content') ? promptEl : (promptEl.closest('.query-content') || promptEl.querySelector('.query-content') || promptEl);

    if (queryContent.querySelector('.ai-toolkit-single-collapse-btn')) return;

    let actionBar = null;
    const copyBtn = queryContent.querySelector('button[aria-label="Copy prompt"], button[mattooltip="Copy prompt"], button.action-button');

    if (copyBtn) {
      actionBar = copyBtn.parentElement.parentElement;
      // Ensure the container allows side-by-side or stacked cleanly
      actionBar.style.display = 'flex';
      // actionBar.style.flexDirection = 'column';
      actionBar.style.alignItems = 'center';
      // actionBar.style.gap = '4px';
    } else {
      actionBar = queryContent.querySelector('message-actions') || queryContent.querySelector('.action-buttons');
    }

    let isForcedAbsolute = false;
    if (!actionBar) {
      actionBar = queryContent;
      queryContent.style.position = queryContent.style.position || 'relative';
      isForcedAbsolute = true;
    }

    const btn = document.createElement('button');
    btn.className = 'ai-toolkit-single-collapse-btn';

    if (isForcedAbsolute) {
      btn.style.position = 'absolute';
      btn.style.top = '-12px';
      btn.style.right = '-12px';
      btn.style.zIndex = '100';
      btn.style.backgroundColor = 'rgba(255,255,255,0.8)';
      btn.style.backdropFilter = 'blur(8px)';
      btn.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
    } else {
      btn.style.marginLeft = '8px';
    }

    btn.setAttribute('data-tooltip', 'Collapse AI Response');
    btn.innerHTML = `<span class="flex items-center justify-center h-8 w-8"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="18" height="18" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"></path></svg></span>`;

    actionBar.prepend(btn);

    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      e.preventDefault();

      const isHidden = window.getComputedStyle(responseEl).display === 'none';
      responseEl.classList.remove('ai-toolkit-response-hidden', 'ai-toolkit-response-expanded');

      if (isHidden) {
        responseEl.classList.add('ai-toolkit-response-expanded');
        btn.innerHTML = `<span class=" flex items-center justify-center h-8 w-8"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="18" height="18" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"></path></svg></span>`;
        btn.setAttribute('data-tooltip', 'Collapse AI Response');
        btn.classList.remove('collapsed');
      } else {
        responseEl.classList.add('ai-toolkit-response-hidden');
        btn.innerHTML = `<span class=" flex items-center justify-center h-8 w-8"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="18" height="18" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5 15l7-7 7 7"></path></svg></span>`;
        btn.setAttribute('data-tooltip', 'Expand AI Response');
        btn.classList.add('collapsed');
      }
    });
  },

  getResponseElements: () => {
    return Array.from(document.querySelectorAll('message-content, .model-response-text'));
  },

  isActive: () => {
    return window.location.hostname.includes('gemini.google.com');
  }
};
