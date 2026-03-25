window.AI_Chat_UI_Highlighter = {
  tooltipDiv: null,
  currentRange: null,

  init: () => {
    // Create Tooltip UI
    const tooltip = document.createElement('div');
    tooltip.id = 'ai-chat-highlighter-tooltip';
    tooltip.className = 'ai-chat-highlighter-tooltip';
    tooltip.innerHTML = `<button id="ai-btn-save-highlight" title="Save Highlight">✨ Save</button>`;
    document.body.appendChild(tooltip);
    window.AI_Chat_UI_Highlighter.tooltipDiv = tooltip;

    document.getElementById('ai-btn-save-highlight').addEventListener('click', window.AI_Chat_UI_Highlighter.saveHighlight);

    // Listen to selection events
    document.addEventListener('selectionchange', () => {
      // Debounce slightly
      clearTimeout(window.AI_Chat_UI_Highlighter.selectionTimeout);
      window.AI_Chat_UI_Highlighter.selectionTimeout = setTimeout(window.AI_Chat_UI_Highlighter.handleSelection, 200);
    });

    // Hide tooltip when clicking away
    document.addEventListener('mousedown', (e) => {
      if (!tooltip.contains(e.target) && e.target.id !== 'ai-btn-save-highlight') {
        tooltip.style.display = 'none';
      }
    });
  },

  handleSelection: () => {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed || selection.toString().trim().length === 0) {
      return;
    }

    const platform = window.AI_Chat_Core.currentPlatform;
    if (!platform) return;

    // Verify selection is within an AI response broadly
    const range = selection.getRangeAt(0);
    let container = range.commonAncestorContainer;
    if (container.nodeType === 3) container = container.parentNode; // text node

    const responses = platform.getResponseElements();
    const isInsideResponse = responses.some(el => el.contains(container));

    if (isInsideResponse) {
      window.AI_Chat_UI_Highlighter.currentRange = range.cloneRange();
      
      const rect = range.getBoundingClientRect();
      const tooltip = window.AI_Chat_UI_Highlighter.tooltipDiv;
      
      tooltip.style.display = 'block';
      tooltip.style.left = `${rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2)}px`;
      tooltip.style.top = `${rect.top + window.scrollY - tooltip.offsetHeight - 8}px`;
    } else {
      window.AI_Chat_UI_Highlighter.tooltipDiv.style.display = 'none';
    }
  },

  saveHighlight: async () => {
    const selection = window.getSelection();
    const text = selection.toString().trim();
    
    if (text.length > 0) {
      const platform = window.AI_Chat_Core.currentPlatform;
      await window.AI_Chat_Storage.saveHighlight(text, platform.domain);
      
      const btn = document.getElementById('ai-btn-save-highlight');
      const originalText = btn.innerHTML;
      btn.innerHTML = '✔ Saved';
      
      selection.removeAllRanges();
      
      setTimeout(() => {
        btn.innerHTML = originalText;
        window.AI_Chat_UI_Highlighter.tooltipDiv.style.display = 'none';
      }, 1000);
    }
  }
};
