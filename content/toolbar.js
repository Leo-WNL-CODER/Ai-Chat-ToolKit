window.AI_Chat_UI_Toolbar = {
  isCollapsed: false,
  isQuestionsOnly: false,

  inject: () => {
    if (document.getElementById('ai-chat-toolkit-toolbar')) return;

    const toolbar = document.createElement('div');
    toolbar.id = 'ai-chat-toolkit-toolbar';
    toolbar.className = 'ai-chat-toolkit-toolbar';
    
    toolbar.innerHTML = `
      <div class="drag-handle">⋮⋮</div>
      <button id="ai-btn-collapse" title="Collapse AI Responses">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="16" height="16"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
      </button>
      <button id="ai-btn-questions" title="Show Only Questions">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="16" height="16"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
      </button>
    `;

    document.body.appendChild(toolbar);

    document.getElementById('ai-btn-collapse').addEventListener('click', window.AI_Chat_UI_Toolbar.toggleCollapse);
    document.getElementById('ai-btn-questions').addEventListener('click', window.AI_Chat_UI_Toolbar.toggleQuestionsOnly);
    
    // Simple drag logic
    let isDragging = false;
    let currentX;
    let currentY;
    let initialX;
    let initialY;
    let xOffset = 0;
    let yOffset = 0;

    const dragHandle = toolbar.querySelector('.drag-handle');

    dragHandle.addEventListener('mousedown', dragStart);
    document.addEventListener('mouseup', dragEnd);
    document.addEventListener('mousemove', drag);

    function dragStart(e) {
      initialX = e.clientX - xOffset;
      initialY = e.clientY - yOffset;
      if (e.target === dragHandle) {
        isDragging = true;
      }
    }

    function dragEnd(e) {
      initialX = currentX;
      initialY = currentY;
      isDragging = false;
    }

    function drag(e) {
      if (isDragging) {
        e.preventDefault();
        currentX = e.clientX - initialX;
        currentY = e.clientY - initialY;
        xOffset = currentX;
        yOffset = currentY;
        toolbar.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
      }
    }
  },

  toggleCollapse: () => {
    const platform = window.AI_Chat_Core.currentPlatform;
    if (!platform) return;

    window.AI_Chat_UI_Toolbar.isCollapsed = !window.AI_Chat_UI_Toolbar.isCollapsed;
    const btn = document.getElementById('ai-btn-collapse');
    
    const responses = platform.getResponseElements();
    responses.forEach(el => {
      el.style.display = window.AI_Chat_UI_Toolbar.isCollapsed ? 'none' : '';
    });

    if (window.AI_Chat_UI_Toolbar.isCollapsed) {
      btn.classList.add('active');
      btn.innerHTML = `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="16" height="16"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"></path></svg>`;
    } else {
      btn.classList.remove('active');
      btn.innerHTML = `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="16" height="16"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>`;
    }
  },

  toggleQuestionsOnly: () => {
    const platform = window.AI_Chat_Core.currentPlatform;
    if (!platform) return;

    window.AI_Chat_UI_Toolbar.isQuestionsOnly = !window.AI_Chat_UI_Toolbar.isQuestionsOnly;
    const btn = document.getElementById('ai-btn-questions');
    
    const responses = platform.getResponseElements();
    const prompts = platform.getPromptElements();

    if (window.AI_Chat_UI_Toolbar.isQuestionsOnly) {
      btn.classList.add('active');
      responses.forEach(el => el.style.display = 'none');
      prompts.forEach(el => {
        el.style.borderLeft = '4px solid #10a37f';
        el.style.paddingLeft = '12px';
      });
    } else {
      btn.classList.remove('active');
      if (!window.AI_Chat_UI_Toolbar.isCollapsed) {
        responses.forEach(el => el.style.display = '');
      }
      prompts.forEach(el => {
        el.style.borderLeft = '';
        el.style.paddingLeft = '';
      });
    }
  }
};
