import React, { useEffect, useState } from 'react';
import { PanelRight, Settings, Zap, Globe, MousePointer, FileText } from 'lucide-react';
import { clsx } from 'clsx';
import { ModelId, MODELS, ContextMode } from '../lib/types';
import { getActiveModel, setActiveModel, getContextMode, setContextMode } from '../lib/storage';

const CONTEXT_OPTIONS: { mode: ContextMode; label: string; icon: React.ReactNode }[] = [
  { mode: 'none',      label: 'Kein Kontext',    icon: <Globe size={13} /> },
  { mode: 'url',       label: 'Nur URL',          icon: <Globe size={13} /> },
  { mode: 'selection', label: 'Markierter Text',  icon: <MousePointer size={13} /> },
  { mode: 'page',      label: 'Ganze Seite',      icon: <FileText size={13} /> },
];

export default function Popup() {
  const [model, setModelSt] = useState<ModelId>('claude-sonnet-4-6');
  const [ctxMode, setCtxModeSt] = useState<ContextMode>('selection');

  useEffect(() => {
    Promise.all([getActiveModel(), getContextMode()]).then(([m, c]) => {
      setModelSt(m);
      setCtxModeSt(c);
    });
  }, []);

  function handleModelChange(id: ModelId) {
    setModelSt(id);
    setActiveModel(id);
  }

  function handleCtxMode(m: ContextMode) {
    setCtxModeSt(m);
    setContextMode(m);
  }

  function openSidebar() {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tabId = tabs[0]?.id;
      if (tabId) chrome.sidePanel.open({ tabId });
    });
    window.close();
  }

  function openSettings() {
    chrome.runtime.openOptionsPage?.();
    window.close();
  }

  const currentModel = MODELS.find((m) => m.id === model) ?? MODELS[0];

  return (
    <div className="bg-[#0f1117] text-slate-200 p-3 flex flex-col gap-3">
      {/* Logo row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sky-400 font-bold text-lg">⚡</span>
          <div>
            <div className="text-sm font-semibold leading-none">RealSync AI</div>
            <div className="text-[10px] text-slate-500 mt-0.5">Multi-Model Browser Assistant</div>
          </div>
        </div>
        <button
          onClick={openSettings}
          className="p-1.5 rounded-lg hover:bg-white/8 text-slate-600 hover:text-slate-400 transition-colors"
        >
          <Settings size={14} />
        </button>
      </div>

      {/* Open sidebar CTA */}
      <button
        onClick={openSidebar}
        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-sm font-medium transition-colors"
      >
        <PanelRight size={15} />
        Sidebar öffnen
      </button>

      {/* Active model */}
      <div>
        <div className="text-[10px] text-slate-600 font-medium uppercase tracking-wider mb-1.5">
          Aktives Modell
        </div>
        <div className="grid grid-cols-1 gap-1">
          {MODELS.filter((m) => ['claude-sonnet-4-6', 'gpt-4o', 'gemini-2.0-flash', 'sonar', 'mistral-large', 'deepseek-v3'].includes(m.id)).map((m) => (
            <button
              key={m.id}
              onClick={() => handleModelChange(m.id)}
              className={clsx(
                'flex items-center gap-2 px-2.5 py-1.5 rounded-lg border text-left transition-colors text-xs',
                m.id === model
                  ? 'border-sky-700 bg-sky-900/30 text-sky-200'
                  : 'border-surface-border hover:border-slate-600 text-slate-400'
              )}
            >
              <span>{m.icon}</span>
              <span className="font-medium">{m.label}</span>
              {m.supportsSearch && (
                <span className="ml-auto text-[9px] bg-teal-900/50 text-teal-400 border border-teal-800/40 rounded px-1">WEB</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Context mode */}
      <div>
        <div className="text-[10px] text-slate-600 font-medium uppercase tracking-wider mb-1.5">
          Kontext-Modus
        </div>
        <div className="grid grid-cols-2 gap-1">
          {CONTEXT_OPTIONS.map((opt) => (
            <button
              key={opt.mode}
              onClick={() => handleCtxMode(opt.mode)}
              className={clsx(
                'flex items-center gap-1.5 px-2 py-1.5 rounded-lg border text-[11px] transition-colors',
                opt.mode === ctxMode
                  ? 'border-sky-700 bg-sky-900/30 text-sky-300'
                  : 'border-surface-border hover:border-slate-600 text-slate-500'
              )}
            >
              {opt.icon}
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Shortcut hint */}
      <div className="text-center text-[10px] text-slate-700">
        Tastenkürzel: <kbd className="bg-surface-raised border border-surface-border rounded px-1 text-slate-500">Ctrl+Shift+Y</kbd>
      </div>
    </div>
  );
}
