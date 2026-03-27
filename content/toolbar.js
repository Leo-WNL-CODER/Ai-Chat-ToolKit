window.AI_Chat_UI_Toolbar = {
  isCollapsed: false,

  inject: () => {
    if (document.getElementById('ai-chat-toolkit-toolbar')) return;

    const toolbar = document.createElement('div');
    toolbar.id = 'ai-chat-toolkit-toolbar';
    toolbar.className = 'ai-chat-toolkit-toolbar';

    toolbar.innerHTML = `
      <div class="drag-handle" title="Drag to move">
        <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="12" r="1.5"></circle><circle cx="9" cy="5" r="1.5"></circle><circle cx="9" cy="19" r="1.5"></circle><circle cx="15" cy="12" r="1.5"></circle><circle cx="15" cy="5" r="1.5"></circle><circle cx="15" cy="19" r="1.5"></circle></svg>
      </div>
      <div class="toolbar-actions">
        <button id="ai-btn-collapse" class="toolbar-btn" data-tooltip="Collapse All AI">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
        </button>
        <button id="ai-btn-questions" class="toolbar-btn" data-tooltip="Questions Navigator">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
        </button>
      </div>
    `;

    document.body.appendChild(toolbar);

    document.getElementById('ai-btn-collapse').addEventListener('click', window.AI_Chat_UI_Toolbar.toggleCollapse);

    // Toggle logic for the Questions Navigator Panel
    const qsBtn = document.getElementById('ai-btn-questions');
    qsBtn.addEventListener('click', window.AI_Chat_UI_Toolbar.toggleQuestionsOnly);

    // Keep auto-close logic mapped solely onto the panel so it doesn't accidentally trigger when moving around the button

    let isDragging = false, panelWasOpen = false;
    let currentX, currentY, initialX, initialY, xOffset = 0, yOffset = 0;
    const dragHandle = toolbar.querySelector('.drag-handle');

    // Shared helper: place the panel to the left or right of the toolbar
    // depending on available screen space.
    window.AI_Chat_UI_Toolbar._positionPanel = (panel) => {
      const tbRect = toolbar.getBoundingClientRect();
      const panelW = panel.offsetWidth || 320;
      const gap = 12;
      const spaceLeft = tbRect.left;
      const spaceRight = window.innerWidth - tbRect.right;

      panel.style.top = tbRect.top + 'px';
      panel.style.right = 'unset';

      if (spaceLeft >= panelW + gap) {
        // Enough room on the left — default position
        panel.style.left = (tbRect.left - panelW - gap) + 'px';
      } else {
        // Too close to the left edge — flip to the right
        panel.style.left = (tbRect.right + gap) + 'px';
      }
    };

    dragHandle.addEventListener('mousedown', (e) => {
      initialX = e.clientX - xOffset;
      initialY = e.clientY - yOffset;
      isDragging = true;

      // Hide panel while dragging; remember if it was open
      const panel = document.getElementById('ai-chat-toolkit-questions-panel');
      panelWasOpen = !!panel;
      if (panel) panel.style.visibility = 'hidden';
    });

    document.addEventListener('mouseup', () => {
      if (!isDragging) return;
      initialX = currentX;
      initialY = currentY;
      isDragging = false;

      // Restore panel at new position if it was open before drag
      const panel = document.getElementById('ai-chat-toolkit-questions-panel');
      if (panelWasOpen && panel) {
        window.AI_Chat_UI_Toolbar._positionPanel(panel);
        panel.style.visibility = '';
      }
    });

    document.addEventListener('mousemove', (e) => {
      if (isDragging) {
        e.preventDefault();
        currentX = e.clientX - initialX;
        currentY = e.clientY - initialY;
        xOffset = currentX;
        yOffset = currentY;
        toolbar.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
      }
    });

  },

  toggleCollapse: () => {
    window.AI_Chat_UI_Toolbar.isCollapsed = !window.AI_Chat_UI_Toolbar.isCollapsed;
    const btn = document.getElementById('ai-btn-collapse');
    const isCollapsed = window.AI_Chat_UI_Toolbar.isCollapsed;

    if (isCollapsed) {
      document.body.classList.add('ai-toolkit-global-collapsed');
      btn.classList.add('active');
      btn.innerHTML = `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"></path></svg>`;
    } else {
      document.body.classList.remove('ai-toolkit-global-collapsed');
      btn.classList.remove('active');
      btn.innerHTML = `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>`;
    }

    // Reset all individual responses overrides
    const responses = document.querySelectorAll('.ai-toolkit-response-hidden, .ai-toolkit-response-expanded');
    responses.forEach(res => {
      res.classList.remove('ai-toolkit-response-hidden', 'ai-toolkit-response-expanded');
    });

    // Synchronize individual collapse buttons with the new global state
    const individualBtns = document.querySelectorAll('.ai-toolkit-single-collapse-btn');
    individualBtns.forEach(ibtn => {
      const pathEl = ibtn.querySelector('path');
      if (pathEl) {
        if (isCollapsed) {
          pathEl.setAttribute('d', 'M5 15l7-7 7 7'); // Expand icon
          ibtn.setAttribute('data-tooltip', 'Expand AI Response');
          ibtn.removeAttribute('title');
          ibtn.classList.add('collapsed');
        } else {
          pathEl.setAttribute('d', 'M19 9l-7 7-7-7'); // Collapse icon
          ibtn.setAttribute('data-tooltip', 'Collapse AI Response');
          ibtn.removeAttribute('title');
          ibtn.classList.remove('collapsed');
        }
      }
    });
  },

  toggleQuestionsOnly: () => {
    let panel = document.getElementById('ai-chat-toolkit-questions-panel');
    const btn = document.getElementById('ai-btn-questions');

    if (panel) {
      panel.remove();
      btn.classList.remove('active');
    } else {
      btn.classList.add('active');
      panel = document.createElement('div');
      panel.id = 'ai-chat-toolkit-questions-panel';
      panel.className = 'ai-chat-toolkit-questions-panel';

      // (position is applied after insertion, once we know the panel width)

      const header = document.createElement('div');
      header.className = 'qs-header';
      const h3 = document.createElement('h3');
      h3.textContent = 'Questions Navigator';
      header.appendChild(h3);
      panel.appendChild(header);

      // Panel Hover Mechanics
      panel.addEventListener('mouseenter', () => {
        clearTimeout(window.AI_Chat_UI_Toolbar.hoverTimeout);
      });

      // Instead of relying on a tiny gap timeout, we just close it smoothly when the mouse explicitly leaves the panel itself!
      panel.addEventListener('mouseleave', () => {
        panel.remove();
        btn.classList.remove('active');
      });

      const list = document.createElement('ul');
      const platform = window.AI_Chat_Core.currentPlatform;
      const prompts = platform ? platform.getPromptElements() : [];
      const seenTexts = new Set();

      let displayIndex = 1;
      prompts.forEach((p) => {
        let rawText = p.textContent.trim();
        if (!rawText) return;

        let text = rawText.substring(0, 80);
        if (rawText.length > 80) text += "...";

        if (seenTexts.has(text)) return; // Skip duplicates automatically
        seenTexts.add(text);

        const li = document.createElement('li');
        li.textContent = text || "Prompt " + displayIndex;
        displayIndex++;

        li.addEventListener('click', () => {
          p.scrollIntoView({ behavior: 'smooth', block: 'center' });
          p.style.transition = 'background-color 0.5s';
          const oldBg = p.style.backgroundColor;
          p.style.backgroundColor = 'rgba(16, 163, 127, 0.2)';
          setTimeout(() => p.style.backgroundColor = oldBg, 1000);
        });
        list.appendChild(li);
      });

      if (prompts.length === 0) {
        list.innerHTML = '<li>No questions found in this chat.</li>';
      }

      panel.appendChild(list);
      document.body.appendChild(panel);

      // After insertion the panel has a real width; position it smartly.
      requestAnimationFrame(() => {
        if (window.AI_Chat_UI_Toolbar._positionPanel) {
          window.AI_Chat_UI_Toolbar._positionPanel(panel);
        }
      });
    }
  }
};
