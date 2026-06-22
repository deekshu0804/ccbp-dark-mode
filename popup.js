const toggle = document.getElementById('toggle');
const status = document.getElementById('status');

// Get current state
chrome.storage.local.get('darkMode', ({ darkMode }) => {
  toggle.checked = !!darkMode;
  updateStatus(!!darkMode);
});

toggle.addEventListener('change', () => {
  chrome.runtime.sendMessage({ action: 'toggle' }, (res) => {
    const isDark = res?.darkMode ?? toggle.checked;
    updateStatus(isDark);
  });
});

function updateStatus(isDark) {
  status.textContent = isDark ? '✓ Dark mode is on' : 'Dark mode is off';
  status.className = 'status' + (isDark ? ' on' : '');
}
