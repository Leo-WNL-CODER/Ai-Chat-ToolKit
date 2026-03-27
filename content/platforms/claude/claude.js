window.AI_Chat_Platform = window.AI_Chat_Platform || {};

window.AI_Chat_Platform.Claude = {
  name: 'claude',
  domain: 'claude.ai',

  getPromptElements: () => {
    return Array.from(document.querySelectorAll('.font-user, [data-is-user="true"]')).filter(el => el.textContent.trim().length > 0);
  },

  injectCollapseButton: (promptEl, responseEl) => {
    const turnWrapper = promptEl.closest('.flex-col') || promptEl.parentElement;

    if (turnWrapper.querySelector('.ai-toolkit-single-collapse-btn')) return; 
    
    // Look for Claude's floating action bar or similar
    let actionBar = turnWrapper.querySelector('.flex.items-center.gap-1') || turnWrapper.querySelector('[data-testid="message-actions"]');
    
    let isForcedAbsolute = false;
    if (!actionBar) {
      actionBar = promptEl;
      promptEl.style.position = promptEl.style.position || 'relative';
      isForcedAbsolute = true;
    }

    const btn = document.createElement('button');
    btn.className = 'ai-toolkit-single-collapse-btn rounded-lg';
    
    btn.style.display = 'flex';
    btn.style.alignItems = 'center';
    btn.style.justifyContent = 'center';
    btn.style.width = '32px';
    btn.style.height = '32px';
    btn.style.cursor = 'pointer';
    btn.style.border = 'none';
    btn.style.background = 'transparent';
    btn.style.color = '#888';
    
    if (isForcedAbsolute) {
      btn.style.position = 'absolute';
      btn.style.top = '-12px'; 
      btn.style.right = '-12px';
      btn.style.zIndex = '100';
      btn.style.backgroundColor = 'rgba(255,255,255,0.8)';
      btn.style.backdropFilter = 'blur(8px)';
      btn.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
      btn.style.borderRadius = '50%';
    } else {
      btn.style.marginLeft = '8px';
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
    return Array.from(document.querySelectorAll('.font-claude, [data-is-user="false"]'));
  },

  isActive: () => {
    return window.location.hostname.includes('claude.ai');
  }
};
