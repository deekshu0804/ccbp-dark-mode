# 🌙 Dark Mode for CCBP Learning Portal

> Tired of the bright white screen at night? This extension adds a smooth dark mode to [learning.ccbp.in](https://learning.ccbp.in) with one click.

![Dark Mode Preview](https://img.shields.io/badge/Chrome-Extension-blue?logo=googlechrome)
![Manifest](https://img.shields.io/badge/Manifest-V3-green)
![License](https://img.shields.io/badge/License-MIT-yellow)

---

## ✨ Features

- 🌙 One-click dark mode toggle
- 💾 Remembers your preference across sessions
- ⚡ Works instantly on page navigation (SPA-friendly)
- 🎯 Built specifically for CCBP / NxtWave portal

---

## 📦 Installation (Chrome)

Since this isn't on the Chrome Web Store yet, install it manually — takes 30 seconds:

1. **Download** this repo as a ZIP → click the green **Code** button → **Download ZIP**
2. **Extract** the ZIP on your computer
3. Open Chrome and go to `chrome://extensions`
4. Enable **Developer Mode** (toggle in top-right corner)
5. Click **Load unpacked**
6. Select the `dark-mode-ext` folder (the one with `manifest.json` inside)
7. Done! Go to [learning.ccbp.in](https://learning.ccbp.in) and click the 🌙 icon

---

## 🔧 How It Works

The extension injects a CSS filter (`invert + hue-rotate`) into the CCBP portal via Chrome's scripting API. Images and videos are re-inverted so they still look normal.

```
dark-mode-ext/
├── manifest.json      # Extension config (Manifest V3)
├── background.js      # Service worker — handles CSS injection + state
├── content.js         # Lightweight page script
├── popup.html         # Toggle UI
├── popup.js           # Popup logic
├── dark.css           # Dark mode styles
└── icons/             # Extension icons
```

---

## 🐛 Issues / Feedback

Found a page that looks broken in dark mode? [Open an issue](../../issues) with a screenshot and I'll fix it.

---

## 🙌 Contributing

Pull requests are welcome! If you want to add features (custom themes, scheduled dark mode, etc.) feel free to fork and submit a PR.

---

## 📄 License

MIT — free to use, modify, and share.
