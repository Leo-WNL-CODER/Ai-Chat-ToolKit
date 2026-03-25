document.addEventListener('DOMContentLoaded', () => {
  const themeSelect = document.getElementById('themeSelect');
  const openSidePanelBtn = document.getElementById('openSidePanelBtn');

  // Load saved theme
  chrome.storage.local.get(['theme'], (result) => {
    if (result.theme) {
      themeSelect.value = result.theme;
      document.body.setAttribute('data-theme', result.theme);
    }
  });

  themeSelect.addEventListener('change', (e) => {
    const theme = e.target.value;
    document.body.setAttribute('data-theme', theme);
    chrome.storage.local.set({ theme });
  });

  openSidePanelBtn.addEventListener('click', () => {
    // Since SidePanel opens via windowId from background service worker/action,
    // We send a message to background script to trigger it if direct window call fails.
    chrome.runtime.sendMessage({ action: 'openSidePanel' });
    window.close();
  });
});
