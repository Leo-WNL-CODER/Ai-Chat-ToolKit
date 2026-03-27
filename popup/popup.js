document.addEventListener('DOMContentLoaded', () => {
  const openSidePanelBtn = document.getElementById('openSidePanelBtn');



  openSidePanelBtn.addEventListener('click', async () => {
    try {
      const win = await chrome.windows.getCurrent();
      await chrome.sidePanel.open({ windowId: win.id });
      window.close();
    } catch (e) {
      console.error('Failed to open side panel:', e);
    }
  });
});
