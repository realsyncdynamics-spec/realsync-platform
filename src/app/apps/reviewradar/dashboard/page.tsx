'use client';
import Link from 'next/link';
import { useState } from 'react';

const mockReviews = [
  { id: '1', platform: 'google', author: 'Marcus K.', rating: 5, text: 'Absolut top Service! Schnell, freundlich und super kompetent. Sehr empfehlenswert!', time: 'vor 2h', replied: false },
  { id: '2', platform: 'trustpilot', author: 'Sandra M.', rating: 3, text: 'Gute Leistung, Wartezeit etwas lang. Insgesamt zufrieden.', time: 'vor 5h', replied: false },
  { id: '3', platform: 'google', author: 'Peter W.', rating: 1, text: 'Schlechter Service, nie wieder!', time: 'vor 8h', replied: false },
  { id: '4', platform: 'provenexpert', author: 'Anna S.', rating: 5, text: 'Wunderbarer Betrieb, immer gerne wieder!', time: 'gestern', replied: true },
  { id: '5', platform: 'yelp', author: 'Tom B.', rating: 4, text: 'Sehr zufrieden, komme gerne wieder.', time: 'vor 2 Tagen', replied: true },
];

const platformEmoji: Record<string, string> = { google: '🔵', trustpilot: '🟢', provenexpert: '🟡', yelp: '🔴' };
const platformColor: Record<string, string> = { google: '#E8F0FE', trustpilot: '#E8F5E9', provenexpert: '#FEF7E0', yelp: '#FCE8E6' };

export default function ReviewRadarDashboard() {
  const [filter, setFilter] = useState<string>('all');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [reviews, setReviews] = useState(mockReviews);

  const filtered = filter === 'all' ? reviews : filter === 'open' ? reviews.filter(r => !r.replied) : reviews.filter(r => r.platform === filter);

  const generateAiReply = async (review: typeof mockReviews[0]) => {
    setAiLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    const templates: Record<number, string> = {
      5: `Vielen herzlichen Dank fuer Ihre wunderbare Bewertung, ${review.author.split(' ')[0]}! Es freut uns sehr, dass Sie mit unserem Service so zufrieden sind. Wir freuen uns auf Ihren naechsten Besuch!`,
      4: `Danke fuer Ihre positive Bewertung, ${review.author.split(' ')[0]}! Wir freuen uns ueber Ihr Feedback und werden weiter daran arbeiten, Ihnen den bestmoeglichen Service zu bieten.`,
      3: `Vielen Dank fuer Ihr ehrliches Feedback, ${review.author.split(' ')[0]}. Es tut uns leid, dass nicht alles Ihren Erwartungen entsprach. Wir nehmen Ihre Anmerkungen sehr ernst und werden uns verbessern.`,
      1: `Liebe/r ${review.author.split(' ')[0]}, wir sind sehr betroffen von Ihrer Erfahrung und entschuldigen uns aufrichtig. Bitte kontaktieren Sie uns direkt unter info@betrieb.de — wir moechten das Problem persoenlich loesen und Sie ueberzeugen.`,
    };
    setReplyText(templates[review.rating] || templates[3]);
    setAiLoading(false);
  };

  const sendReply = (id: string) => {
    setReviews(prev => prev.map(r => r.id === id ? { ...r, replied: true } : r));
    setReplyingTo(null);
    setReplyText('');
  };

  const avgRating = (reviews.reduce((a, r) => a + r.rating, 0) / reviews.length).toFixed(1);
  const unreplied = reviews.filter(r => !r.replied).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-blue-600 text-white px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <Link href="/" className="text-blue-200 text-sm hover:text-white">← RealSync</Link>
            <h1 className="text-xl font-bold mt-1">⭐ ReviewRadar</h1>
            <p className="text-blue-200 text-sm">Mein Betrieb · München</p>
          </div>
          <div className="flex gap-4">
            <div className="bg-white/15 rounded-xl px-4 py-2 text-center">
              <div className="text-2xl font-bold">{avgRating}</div>
              <div className="text-yellow-300 text-sm">★★★★★</div>
              <div className="text-blue-200 text-xs">Ø Rating</div>
            </div>
            <div className="bg-red-500 rounded-xl px-4 py-2 text-center">
              <div className="text-2xl font-bold">{unreplied}</div>
              <div className="text-red-200 text-xs mt-1">Offen</div>
            </div>
          </div>
        </div>
      </div>

      {/* Promo Banner */}
      <div className="bg-yellow-50 border-b border-yellow-200 px-6 py-2">
        <div className="max-w-4xl mx-auto flex items-center gap-3 text-sm">
          <span className="text-yellow-600 font-bold text-xs border border-yellow-400 px-1 rounded">Anzeige</span>
          <span className="text-yellow-800">Upgrade auf Premium — Keine Werbung + ∞ KI-Antworten ab €4,99/Mo</span>
          <Link href="/apps/reviewradar" className="text-blue-600 font-bold ml-auto hover:underline">Upgrade →</Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-6">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          {[
            { label: 'Gesamt', value: reviews.length, sub: '+3 diese Woche' },
            { label: 'Ø Bewertung', value: avgRating, sub: '↑ +0.2' },
            { label: 'Beantwortet', value: reviews.filter(r => r.replied).length, sub: `${Math.round(reviews.filter(r => r.replied).length / reviews.length * 100)}%` },
            { label: 'Offen', value: unreplied, sub: 'Jetzt antworten' },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="text-2xl font-bold text-gray-900">{s.value}</div>
              <div className="text-xs text-gray-500 mt-1">{s.label}</div>
              <div className={`text-xs mt-1 font-semibold ${s.label === 'Offen' && unreplied > 0 ? 'text-red-500' : 'text-green-600'}`}>{s.sub}</div>
            </div>
          ))}
        </div>

        {/* Filter */}
        <div className="flex gap-2 mb-4 flex-wrap">
          {['all', 'open', 'google', 'trustpilot', 'provenexpert', 'yelp'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${filter === f ? 'bg-blue-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-blue-300'}`}>
              {f === 'all' ? 'Alle' : f === 'open' ? `Offen (${unreplied})` : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {/* Reviews */}
        <div className="space-y-3">
          {filtered.map(review => (
            <div key={review.id} className={`bg-white rounded-xl border p-4 ${review.rating <= 2 ? 'border-red-200 border-l-4 border-l-red-500' : 'border-gray-200'}`}>
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center text-lg flex-shrink-0"
                  style={{ backgroundColor: platformColor[review.platform] }}>
                  {platformEmoji[review.platform]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-sm">{review.author}</span>
                    <span className="text-yellow-400 text-xs">{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</span>
                    <span className="text-gray-400 text-xs ml-auto">{review.time}</span>
                    {!review.replied && <span className="bg-red-100 text-red-600 text-xs font-bold px-1.5 py-0.5 rounded">NEU</span>}
                    {review.replied && <span className="bg-green-100 text-green-600 text-xs font-bold px-1.5 py-0.5 rounded">✓</span>}
                  </div>
                  <p className="text-gray-600 text-sm">{review.text}</p>

                  {!review.replied && replyingTo !== review.id && (
                    <div className="flex gap-2 mt-2">
                      <button onClick={() => { setReplyingTo(review.id); generateAiReply(review); }}
                        className="text-xs font-bold px-3 py-1 rounded-full bg-purple-100 text-purple-700 hover:bg-purple-200">
                        ⬡ KI-Antwort
                      </button>
                      <button onClick={() => setReplyingTo(review.id)}
                        className="text-xs font-bold px-3 py-1 rounded-full bg-blue-100 text-blue-700 hover:bg-blue-200">
                        Antworten
                      </button>
                    </div>
                  )}

                  {replyingTo === review.id && (
                    <div className="mt-3">
                      {aiLoading ? (
                        <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-500 animate-pulse">⬡ KI generiert Antwort...</div>
                      ) : (
                        <>
                          <textarea value={replyText} onChange={e => setReplyText(e.target.value)}
                            className="w-full border border-blue-200 rounded-lg p-3 text-sm resize-none focus:outline-none focus:border-blue-500"
                            rows={3} placeholder="Deine Antwort..." />
                          <div className="flex gap-2 mt-2">
                            <button onClick={() => sendReply(review.id)}
                              className="bg-blue-600 text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-blue-700">
                              ✓ Senden
                            </button>
                            <button onClick={() => generateAiReply(review)}
                              className="bg-purple-100 text-purple-700 text-xs font-bold px-4 py-2 rounded-lg hover:bg-purple-200">
                              ⬡ Neu generieren
                            </button>
                            <button onClick={() => { setReplyingTo(null); setReplyText(''); }}
                              className="text-gray-400 text-xs px-2">Abbrechen</button>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
