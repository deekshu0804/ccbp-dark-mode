const APTABASE_KEY = 'A-US-5832103808';
const APTABASE_URL = 'https://us.aptabase.com/v1/event';

async function track(eventName) {
  try {
    const res = await fetch(APTABASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'App-Key': APTABASE_KEY,
      },
      body: JSON.stringify({
        timestamp: new Date().toISOString(),
        sessionId: await getSessionId(),
        eventName,
        systemProps: {
          appVersion: '1.0.0',
          appBuildNumber: '1',
          sdkVersion: 'aptabase-js@0.0.1',
          locale: navigator.language,
          osName: 'Windows',
          osVersion: ''
        },
        props: {}
      }),
    });
    console.log('Aptabase status:', res.status);
  } catch (e) {
    console.log('Aptabase error:', e);
  }
}

async function getSessionId() {
  const { sessionId } = await chrome.storage.local.get('sessionId');
  if (sessionId) return sessionId;
  const newId = crypto.randomUUID();
  await chrome.storage.local.set({ sessionId: newId });
  return newId;
}

chrome.runtime.onInstalled.addListener(({ reason }) => {
  if (reason === 'install') track('installed');
  if (reason === 'update') track('updated');
});

chrome.runtime.onStartup.addListener(() => track('session_started'));

chrome.runtime.onMessage.addListener(({ action }, sender, sendResponse) => {
  chrome.tabs.query({ active: true, currentWindow: true }, async ([tab]) => {
    if (!tab) return;

    if (action === 'getState') {
      const { darkMode } = await chrome.storage.local.get('darkMode');
      sendResponse({ darkMode: !!darkMode });
      return;
    }

    if (action === 'toggle') {
      const { darkMode } = await chrome.storage.local.get('darkMode');
      const newState = !darkMode;
      await chrome.storage.local.set({ darkMode: newState });

      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: (enable) => {
          const ID = 'ccbp-dark-mode-style';
          if (enable) {
            if (document.getElementById(ID)) return;
            const s = document.createElement('style');
            s.id = ID;
            s.textContent = `
                    html { 
                      filter: invert(1) hue-rotate(180deg) !important; 
                      transition: filter 0.3s ease; 
                    }
                    
                    /* Video.js player - counter invert */
                    .video-container,
                    .video-js,
                    .sc-bxJAf,
                    .kTVFMt,
                    video,
                    .vjs-tech,
                    .vjs-poster {
                      filter: invert(1) hue-rotate(180deg) !important;
                    }
                  
                    /* Google Slides iframe */
                    iframe[src*="docs.google.com"],
                    iframe[src*="slides.google"],
                    iframe[src*="googleusercontent"] {
                      filter: invert(1) hue-rotate(180deg) !important;
                    }
                  
                    /* Any other images that get double-inverted */
                    img {
                      filter: invert(1) hue-rotate(180deg) !important;
                    }
                   /* Dim the Google Slides iframe - can't invert inside but reduce brightness */
                    iframe[src*="docs.google.com"],
                    iframe[src*="googleusercontent"],
                    iframe[src*="google.com/presentation"] {
                      opacity: 0.85 !important;
                      filter: brightness(0.9) !important;
                    }
                  `;
            
            document.documentElement.appendChild(s);
          } else {
            document.getElementById(ID)?.remove();
          }
        },
        args: [newState],
      });

      track(newState ? 'dark_mode_enabled' : 'dark_mode_disabled');
      sendResponse({ darkMode: newState });
    }
  });
  return true;
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url?.includes('learning.ccbp.in')) {
    chrome.storage.local.get('darkMode', async ({ darkMode }) => {
      if (!darkMode) return;
      await chrome.scripting.executeScript({
        target: { tabId },
        func: () => {
          const ID = 'ccbp-dark-mode-style';
          if (document.getElementById(ID)) return;
          const s = document.createElement('style');
          s.id = ID;
         s.textContent = `
                      html { 
                        filter: invert(1) hue-rotate(180deg) !important; 
                        transition: filter 0.3s ease; 
                      }
                      
                      /* Video.js player - counter invert */
                      .video-container,
                      .video-js,
                      .sc-bxJAf,
                      .kTVFMt,
                      video,
                      .vjs-tech,
                      .vjs-poster {
                        filter: invert(1) hue-rotate(180deg) !important;
                      }
                    
                      /* Google Slides iframe */
                      iframe[src*="docs.google.com"],
                      iframe[src*="slides.google"],
                      iframe[src*="googleusercontent"] {
                        filter: invert(1) hue-rotate(180deg) !important;
                      }
                    
                      /* Any other images that get double-inverted */
                      img {
                        filter: invert(1) hue-rotate(180deg) !important;
                      }
                      
                   /* Dim the Google Slides iframe - can't invert inside but reduce brightness */
                    iframe[src*="docs.google.com"],
                    iframe[src*="googleusercontent"],
                    iframe[src*="google.com/presentation"] {
                      opacity: 0.85 !important;
                      filter: brightness(0.9) !important;
                    }
                    `;
          document.documentElement.appendChild(s);
        },
      }).catch(() => {});
    });
  }
});
