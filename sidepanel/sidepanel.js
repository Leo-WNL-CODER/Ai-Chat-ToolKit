document.addEventListener('DOMContentLoaded', () => {
  const highlightsList = document.getElementById('highlightsList');
  const searchInput = document.getElementById('searchInput');
  const platformFilter = document.getElementById('platformFilter');
  const clearAllBtn = document.getElementById('clearAllBtn');

  let allHighlights = [];

  // Load theme
  chrome.storage.local.get(['theme'], (result) => {
    if (result.theme) {
      document.body.setAttribute('data-theme', result.theme);
    }
  });

  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === 'local') {
      if (changes.theme) {
        document.body.setAttribute('data-theme', changes.theme.newValue);
      }
      if (changes.highlights) {
        allHighlights = changes.highlights.newValue || [];
        renderHighlights();
      }
    }
  });

  const loadHighlights = () => {
    chrome.storage.local.get(['highlights'], (result) => {
      allHighlights = result.highlights || [];
      renderHighlights();
    });
  };

  const renderHighlights = () => {
    const query = searchInput.value.toLowerCase();
    const platform = platformFilter.value;

    const filtered = allHighlights.filter(h => {
      const matchQuery = h.text.toLowerCase().includes(query);
      const matchPlatform = platform === 'all' || h.domain.includes(platform);
      return matchQuery && matchPlatform;
    });

    highlightsList.innerHTML = '';
    
    if (filtered.length === 0) {
      highlightsList.innerHTML = '<div class="empty-state">No highlights found.</div>';
      return;
    }

    filtered.forEach((h, index) => {
      const item = document.createElement('div');
      item.className = 'highlight-item';

      const dateStr = new Date(h.timestamp).toLocaleString();

      item.innerHTML = `
        <div class="text">${escapeHtml(h.text)}</div>
        <div class="meta">
          <span>${h.domain}</span>
          <span>${dateStr}</span>
        </div>
        <div class="highlight-actions">
          <button class="action-btn copy-btn" data-id="${h.id}">Copy</button>
          <button class="action-btn delete-btn" data-id="${h.id}">Delete</button>
        </div>
      `;
      highlightsList.appendChild(item);
    });

    document.querySelectorAll('.copy-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.target.getAttribute('data-id');
        const highlight = allHighlights.find(hl => hl.id === id);
        if (highlight) {
          navigator.clipboard.writeText(highlight.text);
          e.target.textContent = 'Copied!';
          setTimeout(() => e.target.textContent = 'Copy', 2000);
        }
      });
    });

    document.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.target.getAttribute('data-id');
        const updated = allHighlights.filter(hl => hl.id !== id);
        chrome.storage.local.set({ highlights: updated });
      });
    });
  };

  searchInput.addEventListener('input', renderHighlights);
  platformFilter.addEventListener('change', renderHighlights);

  clearAllBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to delete all highlights?')) {
      chrome.storage.local.set({ highlights: [] });
    }
  });

  loadHighlights();
});

function escapeHtml(unsafe) {
    return unsafe
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
}
