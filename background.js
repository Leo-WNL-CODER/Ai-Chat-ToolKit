chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: false })
  .catch((error) => console.error(error));

chrome.runtime.onInstalled.addListener(() => {
  console.log("AI Chat Productivity Toolkit Installed");
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'openSidePanel') {
    // Attempt to open the side panel
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length > 0) {
        chrome.sidePanel.open({ windowId: tabs[0].windowId });
      }
    });
  }
});
