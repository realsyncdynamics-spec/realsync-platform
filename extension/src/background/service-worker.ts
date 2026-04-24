import { ExtMessage } from '../lib/types';

// ── Open side panel on action click ──────────────────────────
chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch(console.error);

// ── Context menu ──────────────────────────────────────────────
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'realsync-explain',
    title: 'Mit RealSync AI erklären',
    contexts: ['selection'],
  });
  chrome.contextMenus.create({
    id: 'realsync-translate',
    title: 'Mit RealSync AI übersetzen',
    contexts: ['selection'],
  });
  chrome.contextMenus.create({
    id: 'realsync-summarize',
    title: 'Seite zusammenfassen',
    contexts: ['page'],
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (!tab?.id) return;

  chrome.sidePanel.open({ tabId: tab.id }).catch(console.error);

  setTimeout(() => {
    let prompt = '';
    if (info.menuItemId === 'realsync-explain' && info.selectionText) {
      prompt = `Erkläre mir bitte folgenden Text:\n\n"${info.selectionText}"`;
    } else if (info.menuItemId === 'realsync-translate' && info.selectionText) {
      prompt = `Übersetze folgenden Text ins Deutsche:\n\n"${info.selectionText}"`;
    } else if (info.menuItemId === 'realsync-summarize') {
      prompt = 'Bitte fasse den Inhalt dieser Seite kurz zusammen.';
    }

    if (prompt) {
      chrome.tabs.sendMessage(tab.id!, {
        type: 'PREFILL_PROMPT',
        payload: prompt,
      } satisfies ExtMessage);
    }
  }, 500);
});

// ── Forward context updates to side panel ────────────────────
chrome.runtime.onMessage.addListener(
  (message: ExtMessage, sender) => {
    if (message.type === 'CONTEXT_UPDATED' && sender.tab?.id) {
      // Relay to sidebar (same tab)
      chrome.runtime.sendMessage(message).catch(() => {
        // Sidebar may not be open yet — ignore
      });
    }
  }
);
