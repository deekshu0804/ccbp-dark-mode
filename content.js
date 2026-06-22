// Notify background to re-apply dark mode on SPA navigation
chrome.runtime.sendMessage({ action: 'getState' });
