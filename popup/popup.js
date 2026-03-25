document.addEventListener('DOMContentLoaded', () => {
  const openSidePanelBtn = document.getElementById('openSidePanelBtn');



  openSidePanelBtn.addEventListener('click', () => {
    // Since SidePanel opens via windowId from background service worker/action,
    // We send a message to background script to trigger it if direct window call fails.
    chrome.runtime.sendMessage({ action: 'openSidePanel' });
    window.close();
  });
});
