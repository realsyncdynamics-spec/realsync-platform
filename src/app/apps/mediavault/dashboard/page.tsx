'use client';
import { useState } from 'react';
import Link from 'next/link';

const FILES = [
  {id:1, name:'ProductReview_4K_Final.mp4', type:'video', size:'2.4 GB', encrypted:true,  shared:3, date:'heute',     hash:'sha256:a4f2...'},
  {id:2, name:'Thumbnail_Serie_01.psd',     type:'image', size:'156 MB', encrypted:true,  shared:0, date:'gestern',   hash:'sha256:b9c1...'},
  {id:3, name:'Sponsoring_Vertrag_2026.pdf',type:'doc',   size:'1.2 MB', encrypted:true,  shared:1, date:'15.03.',    hash:'sha256:c3e8...'},
  {id:4, name:'Brand_Assets_Pack.zip',      type:'zip',   size:'890 MB', encrypted:false, shared:5, date:'10.03.',    hash:'sha256:d7a2...'},
  {id:5, name:'Voiceover_Draft_v3.mp3',     type:'audio', size:'48 MB',  encrypted:true,  shared:0, date:'08.03.',    hash:'sha256:e1b5...'},
];
const ICONS: Record<string,string> = {video:'🎬',image:'🖼️',doc:'📄',zip:'📦',audio:'🎵'};
const COLORS: Record<string,string> = {video:'#EF4444',image:'#EC4899',doc:'#3B82F6',zip:'#F59E0B',audio:'#8B5CF6'};

export default function MediaVaultDashboard() {
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [files, setFiles] = useState(FILES);

  function simulateUpload() {
    setUploading(true);
    setTimeout(()=>{
      setFiles(p=>[{id:p.length+1,name:`Upload_${Date.now()}.mp4`,type:'video',size:'124 MB',encrypted:true,shared:0,date:'gerade',hash:'sha256:f0d9...'},...p]);
      setUploading(false);
    },2000);
  }

  const totalGB = 3.56;
  const limitGB = 50;

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="border-b border-sky-900/30 px-5 py-3 flex items-center justify-between flex-wrap gap-3" style={{background:'rgba(56,189,248,.04)'}}>
        <div className="flex items-center gap-3">
          <Link href="/hub" className="text-gray-500 text-sm">← Hub</Link>
          <span className="text-gray-700">|</span>
          <span className="font-black text-lg text-sky-400">🗄 MediaVault</span>
          <span className="text-xs px-2 py-0.5 rounded-full font-mono border bg-sky-500/10 text-sky-400 border-sky-500/30">End-to-End Verschlüsselt</span>
        </div>
        <Link href="/pricing" className="text-xs font-bold px-3 py-1.5 rounded-full text-black bg-sky-400">Upgrade</Link>
      </div>

      <div className="grid grid-cols-4 gap-3 p-5">
        {[
          {v:`${totalGB} GB`,   l:'Belegt',         c:'#38BDF8', s:`von ${limitGB} GB`},
          {v:files.length.toString(), l:'Dateien',  c:'#10B981', s:'DSGVO-konform'},
          {v:'AES-256',         l:'Verschlüsselung', c:'#8B5CF6', s:'End-to-End'},
          {v:'3',               l:'Geteilt',         c:'#F59E0B', s:'Aktive Links'},
        ].map(s=>(
          <div key={s.l} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <div className="text-2xl font-black" style={{color:s.c}}>{s.v}</div>
            <div className="text-xs text-gray-500 mt-1 font-mono uppercase tracking-wide">{s.l}</div>
            <div className="text-xs mt-1 font-semibold" style={{color:s.c}}>{s.s}</div>
          </div>
        ))}
      </div>

      {/* Storage Bar */}
      <div className="px-5 mb-4">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div className="flex justify-between text-xs font-mono mb-2">
            <span className="text-gray-400">Speicher genutzt</span>
            <span className="text-sky-400 font-bold">{totalGB} GB / {limitGB} GB</span>
          </div>
          <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-all" style={{width:`${totalGB/limitGB*100}%`,background:'linear-gradient(90deg,#38BDF8,#0EA5E9)'}}/>
          </div>
        </div>
      </div>

      {/* Upload Zone */}
      <div className="px-5 mb-4">
        <div className="bg-gray-900 border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all"
          style={{borderColor:dragging?'#38BDF8':'#374151',background:dragging?'rgba(56,189,248,.05)':'transparent'}}
          onDragEnter={()=>setDragging(true)} onDragLeave={()=>setDragging(false)}
          onClick={simulateUpload}>
          <div className="text-3xl mb-2">{uploading?'⟳':'☁️'}</div>
          <div className="font-bold text-sm mb-1 text-sky-400">{uploading?'Verschlüssele + Upload...':'Dateien hochladen'}</div>
          <div className="text-xs text-gray-500 font-mono">Drag & Drop oder klicken · Automatisch AES-256 verschlüsselt</div>
        </div>
      </div>

      {/* File List */}
      <div className="px-5 pb-8">
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-800">
            <span className="text-xs font-mono text-gray-400 uppercase tracking-widest">// Meine Dateien</span>
          </div>
          <div className="divide-y divide-gray-800">
            {files.map(f=>(
              <div key={f.id} className="px-5 py-3 flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center text-lg flex-shrink-0"
                  style={{background:COLORS[f.type]+'18',border:`1px solid ${COLORS[f.type]}35`}}>
                  {ICONS[f.type]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{f.name}</div>
                  <div className="text-xs text-gray-500 font-mono mt-0.5">{f.hash} · {f.size}</div>
                </div>
                <div className="text-xs text-gray-600 font-mono">{f.date}</div>
                {f.encrypted && <span className="text-xs text-green-400 font-mono">🔒</span>}
                {f.shared>0 && <span className="text-xs text-sky-400 font-mono">👥 {f.shared}</span>}
                <button className="text-xs px-2 py-1 rounded-full bg-gray-800 border border-gray-700 text-gray-500 hover:text-white">⋯</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
