import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
} from 'react';
import {
  Send,
  Plus,
  Settings,
  ChevronDown,
  Globe,
  FileText,
  MousePointer,
  X,
  Trash2,
  RotateCcw,
  Copy,
  Check,
} from 'lucide-react';
import { clsx } from 'clsx';
import {
  ChatMessage,
  ChatSession,
  ModelId,
  MODELS,
  PageContext,
  ContextMode,
} from '../lib/types';
import {
  getSessions,
  saveSession,
  getActiveSessionId,
  setActiveSessionId,
  getActiveModel,
  setActiveModel,
  getContextMode,
  setContextMode,
  generateId,
} from '../lib/storage';
import { streamCompletion } from '../lib/ai-client';
import SettingsPanel from './SettingsPanel';

// ── Simple markdown renderer ──────────────────────────────────
function renderMarkdown(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/```(\w*)\n([\s\S]*?)```/g, '<pre><code>$2</code></pre>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    .replace(/^[-*] (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>\n?)+/g, (m) => `<ul>${m}</ul>`)
    .replace(/\n{2,}/g, '</p><p>')
    .replace(/\n/g, '<br/>')
    .replace(/^(?!<[hup])(.+)/, '<p>$1</p>');
}

// ── Context mode icon ─────────────────────────────────────────
function ContextIcon({ mode }: { mode: ContextMode }) {
  if (mode === 'page') return <FileText size={13} />;
  if (mode === 'selection') return <MousePointer size={13} />;
  return <Globe size={13} />;
}

// ── Copy button ───────────────────────────────────────────────
function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
      className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-white/10 transition-all"
      title="Kopieren"
    >
      {copied ? <Check size={13} className="text-green-400" /> : <Copy size={13} />}
    </button>
  );
}

// ── Chat bubble ───────────────────────────────────────────────
function MessageBubble({ msg }: { msg: ChatMessage }) {
  const isUser = msg.role === 'user';
  const model = MODELS.find((m) => m.id === msg.model);

  return (
    <div className={clsx('flex gap-2 group', isUser ? 'flex-row-reverse' : 'flex-row')}>
      {/* Avatar */}
      <div
        className={clsx(
          'w-7 h-7 rounded-full flex items-center justify-center text-xs flex-shrink-0 mt-0.5',
          isUser ? 'bg-sky-600' : 'bg-surface-raised border border-surface-border'
        )}
        title={model?.label}
      >
        {isUser ? '👤' : (model?.icon ?? '🤖')}
      </div>

      {/* Bubble */}
      <div className={clsx('max-w-[85%] flex flex-col gap-0.5', isUser && 'items-end')}>
        {!isUser && model && (
          <span className="text-[11px] text-slate-500 ml-1">{model.label}</span>
        )}
        <div
          className={clsx(
            'rounded-2xl px-3 py-2 text-sm leading-relaxed',
            isUser
              ? 'bg-sky-600 text-white rounded-tr-sm'
              : msg.error
              ? 'bg-red-900/40 border border-red-800 text-red-200 rounded-tl-sm'
              : 'bg-surface-raised border border-surface-border rounded-tl-sm'
          )}
        >
          {isUser ? (
            <span className="whitespace-pre-wrap">{msg.content}</span>
          ) : (
            <div
              className="prose-ai"
              dangerouslySetInnerHTML={{ __html: renderMarkdown(msg.content) }}
            />
          )}
        </div>
        <div className={clsx('flex items-center gap-1', isUser ? 'flex-row-reverse' : 'flex-row')}>
          <span className="text-[10px] text-slate-600">
            {new Date(msg.timestamp).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })}
          </span>
          {!isUser && <CopyButton text={msg.content} />}
        </div>
      </div>
    </div>
  );
}

// ── Model picker ──────────────────────────────────────────────
function ModelPicker({
  value,
  onChange,
}: {
  value: ModelId;
  onChange: (id: ModelId) => void;
}) {
  const [open, setOpen] = useState(false);
  const current = MODELS.find((m) => m.id === value) ?? MODELS[0];
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const providers = Array.from(new Set(MODELS.map((m) => m.provider)));

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-surface-raised border border-surface-border hover:border-slate-600 text-xs transition-colors"
      >
        <span>{current.icon}</span>
        <span className="font-medium">{current.label}</span>
        <ChevronDown size={12} className={clsx('transition-transform', open && 'rotate-180')} />
      </button>

      {open && (
        <div className="absolute bottom-full mb-1.5 left-0 w-64 bg-[#1a1d27] border border-surface-border rounded-xl shadow-2xl z-50 overflow-hidden">
          <div className="p-2 text-[11px] text-slate-500 font-medium px-3 pt-2.5">Modell wählen</div>
          <div className="overflow-y-auto max-h-72 pb-1">
            {providers.map((provider) => (
              <div key={provider}>
                <div className="px-3 py-1 text-[10px] text-slate-600 uppercase tracking-wider font-semibold">
                  {provider}
                </div>
                {MODELS.filter((m) => m.provider === provider).map((m) => (
                  <button
                    key={m.id}
                    onClick={() => { onChange(m.id); setOpen(false); }}
                    className={clsx(
                      'w-full flex items-center gap-2.5 px-3 py-2 hover:bg-white/5 text-left transition-colors',
                      m.id === value && 'bg-white/8'
                    )}
                  >
                    <span className="text-base">{m.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-medium text-slate-200">{m.label}</span>
                        {m.supportsSearch && (
                          <span className="text-[9px] bg-teal-900/60 text-teal-400 border border-teal-800/50 rounded px-1">WEB</span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-500 truncate">{m.description}</div>
                    </div>
                    {m.id === value && <Check size={12} className="text-sky-400 flex-shrink-0" />}
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Context badge ─────────────────────────────────────────────
function ContextBadge({
  context,
  mode,
  onChangeMode,
}: {
  context: PageContext | null;
  mode: ContextMode;
  onChangeMode: (m: ContextMode) => void;
}) {
  const [open, setOpen] = useState(false);
  const options: { mode: ContextMode; label: string; icon: React.ReactNode }[] = [
    { mode: 'none', label: 'Kein Kontext', icon: <X size={12} /> },
    { mode: 'url', label: 'Nur URL', icon: <Globe size={12} /> },
    { mode: 'selection', label: 'Markierter Text', icon: <MousePointer size={12} /> },
    { mode: 'page', label: 'Ganze Seite', icon: <FileText size={12} /> },
  ];

  const label =
    mode === 'none' ? 'Kein Kontext' :
    mode === 'url' ? 'URL' :
    mode === 'selection' && context?.selectedText ? `"${context.selectedText.slice(0, 28)}…"` :
    mode === 'selection' ? 'Auswahl (leer)' :
    mode === 'page' ? `Seite: ${context?.title?.slice(0, 22) ?? '…'}` : '';

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-surface-raised border border-surface-border hover:border-slate-600 text-[11px] text-slate-400 transition-colors max-w-[160px]"
      >
        <ContextIcon mode={mode} />
        <span className="truncate">{label}</span>
        <ChevronDown size={10} className={clsx('transition-transform flex-shrink-0', open && 'rotate-180')} />
      </button>

      {open && (
        <div className="absolute bottom-full mb-1.5 left-0 w-44 bg-[#1a1d27] border border-surface-border rounded-xl shadow-2xl z-50 overflow-hidden">
          {options.map((opt) => (
            <button
              key={opt.mode}
              onClick={() => { onChangeMode(opt.mode); setOpen(false); }}
              className={clsx(
                'w-full flex items-center gap-2 px-3 py-2 hover:bg-white/5 text-left transition-colors text-xs',
                opt.mode === mode && 'text-sky-400'
              )}
            >
              {opt.icon}
              <span>{opt.label}</span>
              {opt.mode === mode && <Check size={11} className="ml-auto" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Typing indicator ──────────────────────────────────────────
function TypingDots() {
  return (
    <div className="flex items-center gap-1 px-3 py-2">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-slate-500 animate-bounce"
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </div>
  );
}

// ── Welcome screen ────────────────────────────────────────────
const QUICK_PROMPTS = [
  'Diese Seite zusammenfassen',
  'Markierten Text erklären',
  'In 3 Punkte gliedern',
  'Auf Fehler prüfen',
];

function WelcomeScreen({ onPrompt }: { onPrompt: (p: string) => void }) {
  return (
    <div className="flex flex-col items-center justify-center h-full px-5 gap-5">
      <div className="text-center">
        <div className="text-3xl mb-2">⚡</div>
        <div className="text-base font-semibold text-slate-200">RealSync AI</div>
        <div className="text-xs text-slate-500 mt-1">Multi-Model · Browser-Native</div>
      </div>
      <div className="w-full grid grid-cols-1 gap-2">
        {QUICK_PROMPTS.map((p) => (
          <button
            key={p}
            onClick={() => onPrompt(p)}
            className="text-left text-xs px-3 py-2.5 rounded-xl bg-surface-raised border border-surface-border hover:border-slate-600 text-slate-300 hover:text-slate-100 transition-colors"
          >
            {p} →
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Main App ──────────────────────────────────────────────────
export default function App() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [model, setModel] = useState<ModelId>('claude-sonnet-4-6');
  const [input, setInput] = useState('');
  const [streaming, setStreaming] = useState(false);
  const [streamBuffer, setStreamBuffer] = useState('');
  const [context, setContext] = useState<PageContext | null>(null);
  const [contextMode, setContextModeSt] = useState<ContextMode>('selection');
  const [showSettings, setShowSettings] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  const activeSession = sessions.find((s) => s.id === activeId) ?? null;

  // ── Load from storage ───────────────────────────────────────
  useEffect(() => {
    Promise.all([getSessions(), getActiveSessionId(), getActiveModel(), getContextMode()]).then(
      ([s, aid, m, cm]) => {
        setSessions(s);
        setActiveId(aid);
        setModel(m);
        setContextModeSt(cm);
      }
    );
  }, []);

  // ── Fetch page context when mode changes ────────────────────
  const fetchContext = useCallback((mode: ContextMode) => {
    if (mode === 'none') { setContext(null); return; }
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tabId = tabs[0]?.id;
      if (!tabId) return;
      chrome.tabs.sendMessage(tabId, { type: 'GET_PAGE_CONTEXT' }, (resp) => {
        if (chrome.runtime.lastError) return;
        if (resp) setContext(resp as PageContext);
      });
    });
  }, []);

  useEffect(() => { fetchContext(contextMode); }, [contextMode, fetchContext]);

  // ── Listen for selection updates from content script ────────
  useEffect(() => {
    const handler = (msg: unknown) => {
      const m = msg as { type: string; payload?: PageContext };
      if (m.type === 'CONTEXT_UPDATED' && contextMode === 'selection' && m.payload) {
        setContext(m.payload);
      }
      if (m.type === 'PREFILL_PROMPT' && (m as { payload?: string }).payload) {
        setInput((m as { payload: string }).payload);
        inputRef.current?.focus();
      }
    };
    chrome.runtime.onMessage.addListener(handler);
    return () => chrome.runtime.onMessage.removeListener(handler);
  }, [contextMode]);

  // ── Auto scroll ──────────────────────────────────────────────
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeSession?.messages.length, streamBuffer]);

  // ── New session ──────────────────────────────────────────────
  function newSession() {
    const s: ChatSession = {
      id: generateId(),
      title: 'Neuer Chat',
      messages: [],
      model,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setSessions((prev) => [s, ...prev]);
    setActiveId(s.id);
    setActiveSessionId(s.id);
    saveSession(s);
    setInput('');
  }

  // ── Change model ─────────────────────────────────────────────
  function handleModelChange(id: ModelId) {
    setModel(id);
    setActiveModel(id);
  }

  // ── Change context mode ──────────────────────────────────────
  function handleContextMode(m: ContextMode) {
    setContextModeSt(m);
    setContextMode(m);
    fetchContext(m);
  }

  // ── Send message ─────────────────────────────────────────────
  async function send(overrideInput?: string) {
    const text = (overrideInput ?? input).trim();
    if (!text || streaming) return;

    let session = activeSession;
    if (!session) {
      session = {
        id: generateId(),
        title: text.slice(0, 40),
        messages: [],
        model,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      setSessions((prev) => [session!, ...prev]);
      setActiveId(session.id);
      setActiveSessionId(session.id);
    }

    const userMsg: ChatMessage = {
      id: generateId(),
      role: 'user',
      content: text,
      timestamp: Date.now(),
      contextUsed: context,
    };

    const updatedMessages = [...session.messages, userMsg];
    const updatedSession: ChatSession = {
      ...session,
      messages: updatedMessages,
      title: session.messages.length === 0 ? text.slice(0, 40) : session.title,
      updatedAt: Date.now(),
    };

    setSessions((prev) => prev.map((s) => (s.id === updatedSession.id ? updatedSession : s)));
    saveSession(updatedSession);
    setInput('');
    setStreaming(true);
    setStreamBuffer('');

    const assistantId = generateId();

    try {
      const fullText = await streamCompletion(
        model,
        updatedMessages,
        context,
        (delta) => {
          setStreamBuffer((b) => b + delta);
        }
      );

      const assistantMsg: ChatMessage = {
        id: assistantId,
        role: 'assistant',
        content: fullText || streamBuffer,
        model,
        timestamp: Date.now(),
      };

      const finalSession: ChatSession = {
        ...updatedSession,
        messages: [...updatedMessages, assistantMsg],
        updatedAt: Date.now(),
      };

      setSessions((prev) => prev.map((s) => (s.id === finalSession.id ? finalSession : s)));
      saveSession(finalSession);
    } catch (err) {
      const errMsg: ChatMessage = {
        id: assistantId,
        role: 'assistant',
        content: err instanceof Error ? err.message : 'Fehler beim Senden.',
        model,
        timestamp: Date.now(),
        error: true,
      };
      const errSession: ChatSession = {
        ...updatedSession,
        messages: [...updatedMessages, errMsg],
        updatedAt: Date.now(),
      };
      setSessions((prev) => prev.map((s) => (s.id === errSession.id ? errSession : s)));
      saveSession(errSession);
    } finally {
      setStreaming(false);
      setStreamBuffer('');
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  // ── Clear session ────────────────────────────────────────────
  function clearSession() {
    if (!activeSession) return;
    const cleared: ChatSession = { ...activeSession, messages: [], updatedAt: Date.now() };
    setSessions((prev) => prev.map((s) => (s.id === cleared.id ? cleared : s)));
    saveSession(cleared);
  }

  // ── Render ───────────────────────────────────────────────────
  if (showSettings) {
    return <SettingsPanel onClose={() => setShowSettings(false)} />;
  }

  return (
    <div className="flex flex-col h-screen bg-[#0f1117] text-slate-200">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2.5 border-b border-surface-border bg-[#0f1117] flex-shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-base font-bold text-sky-400">⚡</span>
          <span className="text-sm font-semibold">RealSync AI</span>
        </div>
        <div className="flex items-center gap-1">
          {activeSession && activeSession.messages.length > 0 && (
            <button
              onClick={clearSession}
              title="Konversation löschen"
              className="p-1.5 rounded-lg hover:bg-white/8 text-slate-500 hover:text-slate-300 transition-colors"
            >
              <Trash2 size={14} />
            </button>
          )}
          <button
            onClick={newSession}
            title="Neuer Chat"
            className="p-1.5 rounded-lg hover:bg-white/8 text-slate-500 hover:text-slate-300 transition-colors"
          >
            <Plus size={14} />
          </button>
          <button
            onClick={() => setShowSettings(true)}
            title="Einstellungen"
            className="p-1.5 rounded-lg hover:bg-white/8 text-slate-500 hover:text-slate-300 transition-colors"
          >
            <Settings size={14} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-3">
        {!activeSession || activeSession.messages.length === 0 ? (
          <WelcomeScreen onPrompt={(p) => { setInput(p); setTimeout(() => inputRef.current?.focus(), 50); }} />
        ) : (
          <>
            {activeSession.messages.map((msg) => (
              <MessageBubble key={msg.id} msg={msg} />
            ))}
            {streaming && streamBuffer && (
              <div className="flex gap-2">
                <div className="w-7 h-7 rounded-full bg-surface-raised border border-surface-border flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                  {MODELS.find((m) => m.id === model)?.icon ?? '🤖'}
                </div>
                <div className="max-w-[85%] bg-surface-raised border border-surface-border rounded-2xl rounded-tl-sm px-3 py-2 text-sm leading-relaxed">
                  <div
                    className="prose-ai"
                    dangerouslySetInnerHTML={{ __html: renderMarkdown(streamBuffer) }}
                  />
                </div>
              </div>
            )}
            {streaming && !streamBuffer && (
              <div className="flex gap-2">
                <div className="w-7 h-7 rounded-full bg-surface-raised border border-surface-border flex items-center justify-center text-xs flex-shrink-0">
                  {MODELS.find((m) => m.id === model)?.icon ?? '🤖'}
                </div>
                <div className="bg-surface-raised border border-surface-border rounded-2xl rounded-tl-sm">
                  <TypingDots />
                </div>
              </div>
            )}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Context indicator */}
      {context && context.mode !== 'none' && (
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-sky-950/30 border-t border-sky-900/30 text-[11px] text-sky-400 flex-shrink-0">
          <ContextIcon mode={context.mode} />
          <span className="truncate">
            {context.mode === 'selection' && context.selectedText
              ? `"${context.selectedText.slice(0, 50)}…"`
              : context.mode === 'page'
              ? `Seite: ${context.title?.slice(0, 40)}`
              : context.url?.slice(0, 50)}
          </span>
          <button onClick={() => { setContext(null); handleContextMode('none'); }} className="ml-auto hover:text-sky-200">
            <X size={11} />
          </button>
        </div>
      )}

      {/* Input area */}
      <div className="flex-shrink-0 px-3 pb-3 pt-2 border-t border-surface-border">
        <div className="rounded-2xl bg-surface-raised border border-surface-border focus-within:border-sky-700 transition-colors overflow-hidden">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Nachricht eingeben… (Enter zum Senden)"
            rows={3}
            disabled={streaming}
            className="w-full bg-transparent px-3 pt-2.5 pb-1 text-sm text-slate-200 placeholder-slate-600 resize-none outline-none"
            style={{ minHeight: 72, maxHeight: 180 }}
          />
          <div className="flex items-center justify-between px-2 pb-2 gap-2">
            <div className="flex items-center gap-1.5 overflow-hidden">
              <ModelPicker value={model} onChange={handleModelChange} />
              <ContextBadge context={context} mode={contextMode} onChangeMode={handleContextMode} />
            </div>
            <button
              onClick={() => send()}
              disabled={!input.trim() || streaming}
              className="p-2 rounded-xl bg-sky-600 hover:bg-sky-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex-shrink-0"
              title="Senden (Enter)"
            >
              {streaming ? (
                <RotateCcw size={14} className="animate-spin" />
              ) : (
                <Send size={14} />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
