import { ExtMessage, PageContext, ContextMode } from '../lib/types';

const MAX_PAGE_CHARS = 12000;

function getSelectedText(): string {
  return window.getSelection()?.toString().trim() ?? '';
}

function getPageText(): string {
  const skipTags = new Set(['SCRIPT', 'STYLE', 'NOSCRIPT', 'IFRAME', 'OBJECT', 'EMBED', 'SVG']);
  const walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode(node) {
        const el = node.parentElement;
        if (!el) return NodeFilter.FILTER_REJECT;
        if (skipTags.has(el.tagName)) return NodeFilter.FILTER_REJECT;
        const style = window.getComputedStyle(el);
        if (style.display === 'none' || style.visibility === 'hidden') return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      },
    }
  );

  const parts: string[] = [];
  let node: Node | null;
  while ((node = walker.nextNode())) {
    const text = (node.textContent ?? '').replace(/\s+/g, ' ').trim();
    if (text.length > 1) parts.push(text);
  }

  const full = parts.join(' ');
  return full.slice(0, MAX_PAGE_CHARS);
}

function buildContext(mode: ContextMode): PageContext {
  const selectedText = getSelectedText();
  const effectiveMode: ContextMode =
    mode === 'selection' && !selectedText ? 'url' : mode;

  const ctx: PageContext = {
    mode: effectiveMode,
    url: location.href,
    title: document.title,
  };

  if (effectiveMode === 'selection') {
    ctx.selectedText = selectedText;
  } else if (effectiveMode === 'page') {
    const text = getPageText();
    ctx.pageText = text;
    ctx.truncated = text.length >= MAX_PAGE_CHARS;
  }

  return ctx;
}

// ── Listen for messages from the sidebar ─────────────────────
chrome.runtime.onMessage.addListener(
  (message: ExtMessage, _sender, sendResponse) => {
    if (message.type === 'GET_PAGE_CONTEXT') {
      chrome.storage.local.get('rs_context_mode', (result) => {
        const mode: ContextMode = (result.rs_context_mode as ContextMode) ?? 'selection';
        sendResponse(buildContext(mode));
      });
      return true; // keep channel open for async response
    }
  }
);

// ── Notify sidebar when selection changes ─────────────────────
let selectionTimer: ReturnType<typeof setTimeout> | null = null;

document.addEventListener('mouseup', () => {
  if (selectionTimer) clearTimeout(selectionTimer);
  selectionTimer = setTimeout(() => {
    const selected = getSelectedText();
    if (selected.length > 5) {
      chrome.runtime.sendMessage({
        type: 'CONTEXT_UPDATED',
        payload: {
          mode: 'selection',
          url: location.href,
          title: document.title,
          selectedText: selected,
        },
      } satisfies ExtMessage);
    }
  }, 300);
});
