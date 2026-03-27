# AI Chat Productivity Toolkit

A Chrome extension that supercharges your workflow on **ChatGPT** and **Google Gemini** — collapse AI responses, navigate your questions, highlight key insights, and switch themes, all from a sleek floating toolbar.

---

## ✨ Features

### 🧲 Draggable Floating Toolbar
A compact glassmorphic toolbar floats on every supported page. Drag it anywhere on screen via the grip handle at the top. The toolbar stays out of your way while keeping all tools one click away.

### 🔽 Global Response Collapse
Collapse **all** AI responses on the page with a single click — great for long chats where you want to review only the questions. Click again to expand everything back. Individual responses can still be toggled independently.

### 📌 Per-Message Collapse Buttons
Each AI response gets its own inline collapse/expand button, injected right next to the prompt. Useful when you want to focus on a specific part of a long conversation without hiding everything else.

### 🗺️ Questions Navigator Panel
Click the chat bubble icon on the toolbar to open a floating **Questions Navigator** panel that lists all your prompts in the current conversation. Click any entry to smoothly scroll and highlight that prompt in the chat.

- **Smart side placement** — if the toolbar is near the left edge of the screen, the panel opens to the *right* of the toolbar automatically, and vice versa.
- **Hides while dragging** — the panel disappears while you reposition the toolbar and reappears at the correct side once you release.

### ✍️ Text Highlighter
Select any text inside an AI response and a **"✨ Save"** tooltip pops up. Click it to save that snippet to your personal highlights library, tagged with the platform domain and a timestamp.

### 📚 Highlights Side Panel
Open the highlights panel from the extension popup to review all your saved snippets across sessions. Highlights are stored locally using `chrome.storage`.

### 🎨 Theme Switcher
Switch between **Light**, **Dark**, and **Minimal** themes. The selected theme is persisted and applied automatically every time you visit a supported site.

---

## 🌐 Supported Platforms

| Platform | Toolbar | Collapse | Questions Navigator | Highlighter |
|---|---|---|---|---|
| ChatGPT (`chatgpt.com`) | ✅ | ✅ | ✅ | ✅ |
| Google Gemini (`gemini.google.com`) | ✅ | ✅ | ✅ | ✅ |

---

## 🚀 Installation (Developer Mode)

1. Clone or download this repository.
2. Open Chrome and navigate to `chrome://extensions`.
3. Enable **Developer mode** (top-right toggle).
4. Click **Load unpacked** and select the root folder of this project.
5. Navigate to ChatGPT or Gemini — the toolbar will appear automatically.

---

## 🗂️ Project Structure

```
ai-chat-toolkit/
├── manifest.json               # Extension manifest (MV3)
├── background.js               # Service worker
├── popup/                      # Extension popup (theme switcher + highlights button)
├── sidepanel/                  # Highlights viewer side panel
└── content/
    ├── main.js                 # Core init, MutationObserver, platform detection
    ├── toolbar.js              # Floating toolbar + Questions Navigator
    ├── toolbar.css             # Toolbar & panel styles (glassmorphic)
    ├── highlighter.js          # Text selection & highlight saving
    ├── highlighter.css         # Highlighter tooltip styles
    ├── storage.js              # chrome.storage helpers
    ├── theme.css               # Global theme variables
    └── platforms/
        ├── chatgpt/            # ChatGPT-specific selectors & collapse button
        └── gemini/             # Gemini-specific selectors & collapse button
```

---

## 🔒 Permissions

| Permission | Reason |
|---|---|
| `activeTab` | Interact with the current tab |
| `storage` | Persist highlights and theme preference |
| `scripting` | Inject content scripts dynamically |
| `sidePanel` | Open the highlights side panel |

No data leaves your browser. All highlights and settings are stored locally via `chrome.storage.local`.

---

## 📄 License

MIT
