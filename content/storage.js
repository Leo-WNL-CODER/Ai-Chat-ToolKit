window.AI_Chat_Storage = {
  getHighlights: async () => {
    return new Promise((resolve) => {
      chrome.storage.local.get(['highlights'], (result) => {
        resolve(result.highlights || []);
      });
    });
  },
  
  saveHighlight: async (text, domain) => {
    const highlights = await window.AI_Chat_Storage.getHighlights();
    const newHighlight = {
      id: Date.now().toString(),
      text: text,
      domain: domain,
      timestamp: Date.now()
    };
    highlights.unshift(newHighlight); // Add to the beginning
    await chrome.storage.local.set({ highlights });
    return newHighlight;
  },

  getTheme: async () => {
    return new Promise((resolve) => {
      chrome.storage.local.get(['theme'], (result) => {
        resolve(result.theme || 'light');
      });
    });
  }
};
