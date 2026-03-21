'use client';
import { useState } from 'react';
import Link from 'next/link';

const POSTS = [
  { id:1, type:'reel', title:'Behind the Scenes - Photoshoot', views:'2.4M', likes:'184K', comments:3200, platform:'TikTok', protected:true, blockchain:'0x7f3a...', thumb:'bg-gradient-to-br from-purple-600 to-pink-500', duration:'0:45' },
  { id:2, type:'post', title:'Brand Partnership @NikeCreators', views:'890K', likes:'67K', comments:1450, platform:'Instagram', protected:true, blockchain:'0x2b8c...', thumb:'bg-gradient-to-br from-orange-500 to-red-600', duration:null },
  { id:3, type:'reel', title:'Morning Routine 2024 | Aesthetic', views:'5.1M', likes:'420K', comments:8900, platform:'TikTok', protected:true, blockchain:'0x9e1d...', thumb:'bg-gradient-to-br from-cyan-500 to-blue-600', duration:'1:12' },
  { id:4, type:'story', title:'QnA Session Highlights', views:'340K', likes:'28K', comments:890, platform:'Instagram', protected:false, blockchain:null, thumb:'bg-gradient-to-br from-yellow-400 to-orange-500', duration:'0:30' },
  { id:5, type:'reel', title:'Product Review - Tech Gadgets 2024', views:'1.8M', likes:'142K', comments:4100, platform:'YouTube', protected:true, blockchain:'0x4c7b...', thumb:'bg-gradient-to-br from-green-500 to-teal-600', duration:'3:28' },
  { id:6, type:'post', title:'New Collection Drop - Exclusive', views:'450K', likes:'39K', comments:2300, platform:'Instagram', protected:true, blockchain:'0xf1e2...', thumb:'bg-gradient-to-br from-indigo-500 to-purple-600', duration:null },
];

const PLATFORMS = [
  { name:'Instagram', followers:'1.2M', icon:'📷', color:'from-pink-500 to-purple-600' },
  { name:'TikTok', followers:'3.8M', icon:'🎵', color:'from-red-500 to-red-800' },
  { name:'YouTube', followers:'890K', icon:'🎥', color:'from-red-600 to-red-900' },
  { name:'X/Twitter', followers:'220K', icon:'✖', color:'from-zinc-700 to-zinc-900' },
];

const COLLABS = [
  { brand:'Nike', type:'Brand Deal', budget:'5.000€', status:'Active', deadline:'2024-02-28', deliverables:'3 Reels + 5 Stories' },
  { brand:'Apple', type:'Product Review', budget:'3.200€', status:'Pending', deadline:'2024-03-15', deliverables:'2 YouTube Videos' },
  { brand:'Samsung', type:'Sponsored Post', budget:'1.800€', status:'Completed', deadline:'2024-01-20', deliverables:'4 Instagram Posts' },
  { brand:'Spotify', type:'Campaign', budget:'4.500€', status:'Active', deadline:'2024-03-01', deliverables:'6 TikToks' },
];

export default function CreatorPage() {
  const [tab, setTab] = useState('feed');
  const [filter, setFilter] = useState('all');
  const filtered = filter === 'all' ? POSTS : POSTS.filter(p => p.type === filter);

  return (
    <div className="min-h-screen bg-black text-white">
      <nav className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 sticky top-0 z-50 bg-black/90 backdrop-blur">
        <Link href="/" className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">RealSync</Link>
        <div className="flex gap-3">
          <Link href="/creator/tools" className="bg-yellow-500 text-black px-4 py-1.5 rounded-lg font-semibold text-sm hover:bg-yellow-400">Creator Tools</Link>
          <Link href="/dashboard" className="border border-zinc-700 px-4 py-1.5 rounded-lg text-sm">Dashboard</Link>
        </div>
      </nav>

      <div className="h-48 bg-gradient-to-r from-purple-900 via-pink-900 to-orange-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_30%_50%,rgba(255,200,0,0.4),transparent)]" />
      </div>

      <div className="px-6 pb-6">
        <div className="flex items-end justify-between -mt-14 mb-4">
          <div className="w-24 h-24 rounded-full border-4 border-black bg-gradient-to-br from-cyan-400 to-purple-600 flex items-center justify-center text-3xl font-bold">RC</div>
          <div className="flex gap-2 mt-4">
            <button className="bg-yellow-500 text-black px-5 py-2 rounded-full font-semibold text-sm">Follow</button>
            <button className="border border-zinc-700 px-5 py-2 rounded-full text-sm">Message</button>
            <button className="border border-zinc-700 px-3 py-2 rounded-full text-sm">🔔</button>
          </div>
        </div>
        <h1 className="text-2xl font-bold">RealCreator</h1>
        <p className="text-gray-400 text-sm mt-1">@realcreator • ✅ Verified • 🔗 Blockchain-Protected</p>
        <p className="text-gray-300 mt-2 max-w-xl">Content Creator | KI & Tech | Lifestyle | Brand Deals welcome 📧 collab@realcreator.io</p>
        <div className="flex gap-4 mt-3 text-sm">
          <span><b className="text-white">6.1M</b> <span className="text-gray-400">Followers</span></span>
          <span><b className="text-white">890</b> <span className="text-gray-400">Following</span></span>
          <span><b className="text-white">284</b> <span className="text-gray-400">Posts</span></span>
        </div>
        <div className="flex gap-2 mt-4 flex-wrap">
          {PLATFORMS.map(p=>(
            <div key={p.name} className={`bg-gradient-to-r ${p.color} px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5`}>
              <span>{p.icon}</span><span>{p.name}</span><span className="text-white/70">{p.followers}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 p-3 bg-zinc-900 border border-purple-500/30 rounded-xl inline-flex items-center gap-3">
          <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-xs font-bold">P</div>
          <div>
            <p className="text-xs text-gray-400">Polygon Blockchain Verified</p>
            <p className="text-xs font-mono text-yellow-400">0x7f3a9b2c1e8d4f5a6b7c8d9e0f1a2b3c</p>
          </div>
          <span className="text-green-400 text-xs font-semibold">✓ Authentic</span>
        </div>
      </div>

      <div className="grid grid-cols-4 border-y border-zinc-800 mx-6 mb-6">
        {[{l:'Total Views',v:'24.8M'},{l:'Engagement',v:'8.4%'},{l:'Protected',v:'94%'},{l:'Earnings/Mo',v:'12.4K€'}].map(s=>(
          <div key={s.l} className="text-center py-4 border-r border-zinc-800 last:border-r-0">
            <p className="text-xl font-bold">{s.v}</p><p className="text-xs text-gray-400">{s.l}</p>
          </div>
        ))}
      </div>

      <div className="flex border-b border-zinc-800 px-6 mb-6 overflow-x-auto">
        {['feed','reels','collabs','shop','blockchain'].map(t=>(
          <button key={t} onClick={()=>setTab(t)} className={`px-5 py-3 text-sm capitalize font-medium border-b-2 whitespace-nowrap transition-colors ${tab===t?'border-yellow-400 text-yellow-400':'border-transparent text-gray-400 hover:text-white'}`}>{t}</button>
        ))}
      </div>

      <div className="px-6 pb-16">
        {(tab==='feed'||tab==='reels')&&(
          <div>
            <div className="flex gap-2 mb-6">
              {['all','reel','post','story'].map(f=>(
                <button key={f} onClick={()=>setFilter(f)} className={`px-4 py-1.5 rounded-full text-sm capitalize ${filter===f?'bg-yellow-500 text-black font-semibold':'bg-zinc-900 border border-zinc-800'}`}>{f}</button>
              ))}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {filtered.map(p=>(
                <div key={p.id} className="group relative rounded-xl overflow-hidden cursor-pointer">
                  <div className={`${p.thumb} aspect-square flex items-center justify-center relative`}>
                    {p.type==='reel'&&(
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm group-hover:scale-110 transition-transform">
                          <span className="text-xl ml-1">▶</span>
                        </div>
                      </div>
                    )}
                    {p.duration&&<span className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded font-mono">{p.duration}</span>}
                    {p.protected&&<span className="absolute top-2 left-2 bg-green-500/90 text-white text-xs px-2 py-0.5 rounded-full">🔒</span>}
                    <span className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded-full">{p.platform}</span>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-3 translate-y-full group-hover:translate-y-0 transition-transform">
                    <p className="text-sm font-medium line-clamp-1">{p.title}</p>
                    <div className="flex gap-2 text-xs text-gray-300 mt-1">
                      <span>👁 {p.views}</span><span>❤ {p.likes}</span><span>💬 {p.comments.toLocaleString()}</span>
                    </div>
                    {p.blockchain&&<p className="text-xs text-yellow-400 mt-1 font-mono">{p.blockchain}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab==='collabs'&&(
          <div className="space-y-4">
            {COLLABS.map(c=>(
              <div key={c.brand} className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-zinc-800 rounded-xl flex items-center justify-center font-bold text-lg">{c.brand[0]}</div>
                  <div>
                    <p className="font-semibold">{c.brand} <span className="text-xs text-gray-400 font-normal">{c.type}</span></p>
                    <p className="text-sm text-gray-400">{c.deliverables}</p>
                    <p className="text-xs text-gray-500">Deadline: {c.deadline}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-yellow-400">{c.budget}</p>
                  <span className={`text-xs px-2 py-1 rounded-full ${c.status==='Active'?'bg-green-900 text-green-400':c.status==='Pending'?'bg-yellow-900 text-yellow-400':'bg-zinc-700 text-gray-400'}`}>{c.status}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab==='shop'&&(
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[{n:'Preset Pack Vol.1',p:'29€',t:'Digital',s:1240},{n:'Lightroom Bundle',p:'49€',t:'Digital',s:890},{n:'Creator Course',p:'199€',t:'Course',s:456},{n:'Brand Kit Template',p:'39€',t:'Digital',s:670},{n:'1on1 Coaching',p:'299€',t:'Service',s:89},{n:'Exclusive Pass',p:'9.99€/mo',t:'Sub',s:2100}].map(item=>(
              <div key={item.n} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 hover:border-yellow-500/50 transition-colors cursor-pointer">
                <div className="w-full h-24 bg-zinc-800 rounded-lg mb-3 flex items-center justify-center text-3xl">{item.t==='Course'?'🎓':item.t==='Service'?'⭐':item.t==='Sub'?'🔑':'📦'}</div>
                <p className="font-semibold text-sm">{item.n}</p>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-yellow-400 font-bold">{item.p}</span>
                  <span className="text-xs text-gray-500">{item.s} sold</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab==='blockchain'&&(
          <div className="space-y-4">
            <div className="bg-zinc-900 border border-purple-500/30 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center font-bold">P</div>
                <div><h3 className="font-bold">Polygon Blockchain Wallet</h3><p className="text-xs text-gray-400">Mumbai Testnet / Mainnet</p></div>
                <span className="ml-auto text-green-400 text-sm">✓ Connected</span>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {[{l:'NFTs Minted',v:'47'},{l:'MATIC Balance',v:'234.8'},{l:'Royalties',v:'1.840€'}].map(s=>(
                  <div key={s.l} className="bg-zinc-800 rounded-lg p-3 text-center">
                    <p className="text-lg font-bold text-purple-400">{s.v}</p><p className="text-xs text-gray-400">{s.l}</p>
                  </div>
                ))}
              </div>
            </div>
            {POSTS.filter(p=>p.blockchain).map(p=>(
              <div key={p.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex items-center gap-4">
                <div className={`${p.thumb} w-14 h-14 rounded-lg flex-shrink-0`} />
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{p.title}</p>
                  <p className="text-xs font-mono text-yellow-400">{p.blockchain}</p>
                  <p className="text-xs text-gray-500">Polygon • C2PA Verified</p>
                </div>
                <span className="text-green-400 text-xs px-2 py-1 bg-green-900/40 rounded-full">✓ On-Chain</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
