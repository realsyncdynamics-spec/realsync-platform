import React, { useState, useEffect } from 'react';
import { ArrowLeft, Key, Eye, EyeOff, Save, Trash2, ExternalLink } from 'lucide-react';
import { clsx } from 'clsx';
import { ApiKeys, ExtSettings } from '../lib/types';
import { getApiKeys, setApiKeys, getSettings, saveSettings } from '../lib/storage';

interface Props {
  onClose: () => void;
}

function KeyField({
  label,
  provider,
  placeholder,
  value,
  onChange,
}: {
  label: string;
  provider: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const [visible, setVisible] = useState(false);
  return (
    <div>
      <label className="text-[11px] text-slate-500 font-medium uppercase tracking-wider block mb-1">
        {label}
      </label>
      <div className="flex items-center gap-1 bg-[#0f1117] border border-surface-border rounded-lg overflow-hidden focus-within:border-sky-700 transition-colors">
        <Key size={12} className="ml-2.5 text-slate-600 flex-shrink-0" />
        <input
          type={visible ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1 bg-transparent text-xs text-slate-300 px-2 py-2 outline-none placeholder-slate-700"
          spellCheck={false}
          autoComplete="off"
        />
        {value && (
          <button
            onClick={() => onChange('')}
            className="px-1.5 text-slate-600 hover:text-red-400 transition-colors"
            title="Löschen"
          >
            <Trash2 size={11} />
          </button>
        )}
        <button
          onClick={() => setVisible((v) => !v)}
          className="px-2 text-slate-600 hover:text-slate-400 transition-colors"
          title={visible ? 'Verstecken' : 'Anzeigen'}
        >
          {visible ? <EyeOff size={12} /> : <Eye size={12} />}
        </button>
      </div>
    </div>
  );
}

export default function SettingsPanel({ onClose }: Props) {
  const [keys, setKeys] = useState<ApiKeys>({});
  const [settings, setSettingsSt] = useState<ExtSettings | null>(null);
  const [saved, setSaved] = useState(false);
  const [gatewayUrl, setGatewayUrl] = useState('');

  useEffect(() => {
    Promise.all([getApiKeys(), getSettings()]).then(([k, s]) => {
      setKeys(k);
      setSettingsSt(s);
      setGatewayUrl(s.gatewayUrl);
    });
  }, []);

  async function handleSave() {
    await Promise.all([
      setApiKeys(keys),
      saveSettings({ ...settings!, gatewayUrl }),
    ]);
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  }

  function updateKey(provider: keyof ApiKeys, value: string) {
    setKeys((k) => ({ ...k, [provider]: value || undefined }));
  }

  const keyDefs: { label: string; provider: keyof ApiKeys; placeholder: string; docsUrl: string }[] = [
    { label: 'Anthropic (Claude)', provider: 'anthropic', placeholder: 'sk-ant-…', docsUrl: 'https://console.anthropic.com' },
    { label: 'OpenAI (GPT-4)', provider: 'openai', placeholder: 'sk-…', docsUrl: 'https://platform.openai.com/api-keys' },
    { label: 'Google (Gemini)', provider: 'google', placeholder: 'AIza…', docsUrl: 'https://aistudio.google.com/app/apikey' },
    { label: 'Perplexity (Sonar)', provider: 'perplexity', placeholder: 'pplx-…', docsUrl: 'https://www.perplexity.ai/settings/api' },
    { label: 'Mistral AI', provider: 'mistral', placeholder: '…', docsUrl: 'https://console.mistral.ai' },
    { label: 'DeepSeek', provider: 'deepseek', placeholder: 'sk-…', docsUrl: 'https://platform.deepseek.com' },
  ];

  return (
    <div className="flex flex-col h-screen bg-[#0f1117] text-slate-200">
      {/* Header */}
      <div className="flex items-center gap-2 px-3 py-2.5 border-b border-surface-border flex-shrink-0">
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg hover:bg-white/8 text-slate-500 hover:text-slate-300 transition-colors"
        >
          <ArrowLeft size={15} />
        </button>
        <span className="text-sm font-semibold">Einstellungen</span>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-3 py-4 flex flex-col gap-5">
        {/* BYO API Keys */}
        <section>
          <div className="text-xs font-semibold text-slate-300 mb-1">Eigene API-Schlüssel (BYO)</div>
          <p className="text-[11px] text-slate-600 mb-3 leading-relaxed">
            Schlüssel werden lokal gespeichert und direkt an den Anbieter gesendet — ohne Umweg über RealSync.
          </p>
          <div className="flex flex-col gap-2.5">
            {keyDefs.map((kd) => (
              <div key={kd.provider}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] text-slate-500 font-medium uppercase tracking-wider">
                    {kd.label}
                  </span>
                  <a
                    href={kd.docsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[10px] text-sky-600 hover:text-sky-400 flex items-center gap-0.5"
                  >
                    API Key <ExternalLink size={9} />
                  </a>
                </div>
                <div className="flex items-center gap-1 bg-[#0f1117] border border-surface-border rounded-lg overflow-hidden focus-within:border-sky-700 transition-colors">
                  <Key size={12} className="ml-2.5 text-slate-600 flex-shrink-0" />
                  <input
                    type="password"
                    value={keys[kd.provider] ?? ''}
                    onChange={(e) => updateKey(kd.provider, e.target.value)}
                    placeholder={kd.placeholder}
                    className="flex-1 bg-transparent text-xs text-slate-300 px-2 py-2 outline-none placeholder-slate-700"
                    spellCheck={false}
                    autoComplete="off"
                  />
                  {keys[kd.provider] && (
                    <button
                      onClick={() => updateKey(kd.provider, '')}
                      className="px-2 text-slate-600 hover:text-red-400 transition-colors"
                    >
                      <Trash2 size={11} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Gateway */}
        <section>
          <div className="text-xs font-semibold text-slate-300 mb-1">RealSync Gateway URL</div>
          <p className="text-[11px] text-slate-600 mb-2">
            Wird genutzt, wenn kein eigener API-Key vorhanden ist.
          </p>
          <input
            type="url"
            value={gatewayUrl}
            onChange={(e) => setGatewayUrl(e.target.value)}
            className="w-full bg-[#0f1117] border border-surface-border rounded-lg px-3 py-2 text-xs text-slate-300 outline-none focus:border-sky-700 transition-colors"
            placeholder="https://realsyncdynamics.de/api/ai-gateway"
          />
        </section>

        {/* Language */}
        {settings && (
          <section>
            <div className="text-xs font-semibold text-slate-300 mb-2">Sprache</div>
            <div className="flex gap-2">
              {(['de', 'en'] as const).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setSettingsSt((s) => s ? { ...s, language: lang } : s)}
                  className={clsx(
                    'flex-1 py-2 rounded-lg border text-xs font-medium transition-colors',
                    settings.language === lang
                      ? 'border-sky-600 bg-sky-900/30 text-sky-300'
                      : 'border-surface-border hover:border-slate-600 text-slate-500'
                  )}
                >
                  {lang === 'de' ? '🇩🇪 Deutsch' : '🇬🇧 English'}
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Theme */}
        {settings && (
          <section>
            <div className="text-xs font-semibold text-slate-300 mb-2">Design</div>
            <div className="flex gap-2">
              {(['dark', 'light', 'system'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setSettingsSt((s) => s ? { ...s, theme: t } : s)}
                  className={clsx(
                    'flex-1 py-2 rounded-lg border text-xs transition-colors',
                    settings.theme === t
                      ? 'border-sky-600 bg-sky-900/30 text-sky-300'
                      : 'border-surface-border hover:border-slate-600 text-slate-500'
                  )}
                >
                  {t === 'dark' ? '🌑 Dark' : t === 'light' ? '☀️ Light' : '💻 System'}
                </button>
              ))}
            </div>
          </section>
        )}

        {/* About */}
        <section className="border-t border-surface-border pt-4">
          <div className="text-[11px] text-slate-600 space-y-1">
            <div>RealSync AI Extension v1.0.0</div>
            <div>© 2026 RealSync Dynamics · DSGVO-konform · Daten bleiben lokal</div>
          </div>
        </section>
      </div>

      {/* Save button */}
      <div className="flex-shrink-0 px-3 pb-3 pt-2 border-t border-surface-border">
        <button
          onClick={handleSave}
          className={clsx(
            'w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all',
            saved
              ? 'bg-green-700 text-green-100'
              : 'bg-sky-600 hover:bg-sky-500 text-white'
          )}
        >
          <Save size={14} />
          {saved ? 'Gespeichert ✓' : 'Speichern'}
        </button>
      </div>
    </div>
  );
}
