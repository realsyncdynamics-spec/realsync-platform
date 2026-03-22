import Link from 'next/link';

function QRMini({ value, size=120 }: { value: string; size?: number }) {
  const cells=21, cs=Math.floor(size/cells);
  const h = value.split('').reduce((a:number,c:string)=>((a<<5)-a+c.charCodeAt(0))|0, 5381);
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <rect width={size} height={size} fill="white" rx="8"/>
      {Array.from({length:cells},(_,r)=>Array.from({length:cells},(_,c)=>{
        const fp=(r<7&&c<7)||(r<7&&c>=cells-7)||(r>=cells-7&&c<7);
        const on=fp||((h^(r*31+c*17))&1)===1;
        return on?<rect key={`${r}${c}`} x={c*cs} y={r*cs} width={cs} height={cs} fill="#0A0A0F"/>:null;
      }))}
    </svg>
  );
}

function Barcode({ value, w=200, h=44 }: { value:string; w?:number; h?:number }) {
  let x=6; const bars: React.ReactNode[] = [];
  for(let i=0;i<Math.min(value.length,28);i++){
    const bw=(value.charCodeAt(i)%3+1)*2.2, gap=i%4===0?3:1.5;
    bars.push(<rect key={i} x={x} y={4} width={bw} height={h-14} fill="#0A0A0F"/>);
    x+=bw+gap;
  }
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <rect width={w} height={h} fill="white" rx="4"/>
      {bars}
      <text x={w/2} y={h-1} textAnchor="middle" fontSize="6" fontFamily="monospace" fill="#444">{value}</text>
    </svg>
  );
}

export default function CreatorProfilePage({ params }: { params: { username: string } }) {
  const { username } = params;
  // In prod: fetch from Supabase by username
  const creator = {
    name: username === 'dominik_steiner' ? 'Dominik Steiner' : username.replace(/_/g,' ').replace(/\b\w/g, c=>c.toUpperCase()),
    username,
    avatar: '🎬',
    plan: 'gold',
    niche: 'Tech & Startup',
    bio: 'Creator · Entrepreneur · Building RealSync Dynamics',
    code: `RS-2026-${username.toUpperCase().slice(0,6)}`,
    trustScore: 98.2,
    verifyLevel: 4,
    socials: [
      {platform:'YouTube',  icon:'📺', color:'#FF0000', url:'#', followers:'12K'},
      {platform:'TikTok',   icon:'🎵', color:'#00F2EA', url:'#', followers:'8.4K'},
      {platform:'Instagram',icon:'📸', color:'#E1306C', url:'#', followers:'5.2K'},
    ],
    verified: true,
  };

  const profileUrl = `realsync-platform.vercel.app/creator/${username}`;
  const joinUrl    = `realsync-platform.vercel.app/join/${username}`;

  return (
    <div className="min-h-screen bg-[#03050A] text-white" style={{fontFamily:"'Syne',sans-serif"}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=DM+Mono:wght@400;500&display=swap');`}</style>

      {/* Header */}
      <div style={{background:'rgba(3,5,10,.97)',borderBottom:'1px solid #0F1520',padding:'0 20px',height:48,display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <Link href="/" style={{display:'flex',alignItems:'center',gap:7,textDecoration:'none'}}>
          <div style={{width:12,height:12,border:'2px solid #C9A84C',transform:'rotate(45deg)',position:'relative'}}>
            <div style={{position:'absolute',inset:2.5,background:'#C9A84C'}}/>
          </div>
          <span style={{fontWeight:800,fontSize:12,color:'#E4E6EF'}}>RealSync<span style={{color:'#C9A84C'}}>Dynamics</span></span>
        </Link>
        <Link href={`/join/${username}`} style={{fontFamily:"'DM Mono',monospace",fontSize:11,padding:'5px 14px',background:'linear-gradient(135deg,#00D4FF,#0070F3)',borderRadius:8,color:'#000',fontWeight:700,textDecoration:'none'}}>
          Kostenlos starten
        </Link>
      </div>

      {/* Profile Hero */}
      <div style={{maxWidth:640,margin:'0 auto',padding:'40px 20px 20px'}}>
        <div style={{background:'#080C14',border:'1px solid #1A2130',borderRadius:20,padding:'32px',textAlign:'center',marginBottom:20,position:'relative',overflow:'hidden'}}>
          <div style={{position:'absolute',top:0,left:0,right:0,height:4,background:'linear-gradient(90deg,#C9A84C,#00D4FF)'}}/>

          <div style={{fontSize:56,marginBottom:12}}>{creator.avatar}</div>
          <h1 style={{fontWeight:900,fontSize:24,marginBottom:4}}>{creator.name}</h1>
          <div style={{fontFamily:"'DM Mono',monospace",fontSize:11,color:'rgba(255,255,255,.4)',marginBottom:12}}>
            @{creator.username} · {creator.niche}
          </div>
          <p style={{fontSize:14,color:'rgba(255,255,255,.6)',marginBottom:20,lineHeight:1.6}}>{creator.bio}</p>

          {/* Trust Score */}
          <div style={{display:'flex',gap:12,justifyContent:'center',flexWrap:'wrap',marginBottom:20}}>
            {[
              {v:creator.trustScore.toString(),l:'Trust Score',c:'#10B981'},
              {v:'C2PA',l:'2.3 ✓',c:'#C9A84C'},
              {v:'⛓',l:'Blockchain',c:'#8B5CF6'},
            ].map(s=>(
              <div key={s.l} style={{textAlign:'center',background:'rgba(255,255,255,.03)',border:'1px solid #1A2130',borderRadius:10,padding:'10px 16px'}}>
                <div style={{fontWeight:900,fontSize:18,color:s.c}}>{s.v}</div>
                <div style={{fontFamily:"'DM Mono',monospace",fontSize:8,color:'rgba(255,255,255,.3)',marginTop:2}}>{s.l}</div>
              </div>
            ))}
          </div>

          {/* Socials */}
          <div style={{display:'flex',gap:10,justifyContent:'center',marginBottom:24}}>
            {creator.socials.map(s=>(
              <a key={s.platform} href={s.url}
                style={{display:'flex',alignItems:'center',gap:7,padding:'8px 14px',background:s.color+'15',border:`1px solid ${s.color}30`,borderRadius:20,textDecoration:'none',transition:'all .15s'}}>
                <span style={{fontSize:14}}>{s.icon}</span>
                <span style={{fontFamily:"'DM Mono',monospace",fontSize:10,color:s.color}}>{s.followers}</span>
              </a>
            ))}
          </div>

          {/* Verified Badge */}
          <div style={{display:'inline-flex',alignItems:'center',gap:8,background:'rgba(201,168,76,.08)',border:'1px solid rgba(201,168,76,.25)',borderRadius:20,padding:'8px 16px',marginBottom:20}}>
            <span>🛡</span>
            <span style={{fontFamily:"'DM Mono',monospace",fontSize:10,color:'#C9A84C'}}>Verifizierter Creator · Code: {creator.code}</span>
          </div>
        </div>

        {/* QR Codes */}
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14,marginBottom:20}}>
          <div style={{background:'#080C14',border:'1px solid rgba(201,168,76,.2)',borderRadius:16,padding:20,textAlign:'center'}}>
            <div style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:'#C9A84C',textTransform:'uppercase',letterSpacing:'.15em',marginBottom:12}}>Mein Profil</div>
            <div style={{display:'flex',justifyContent:'center',marginBottom:10}}>
              <div style={{background:'white',padding:8,borderRadius:10,boxShadow:'0 0 20px rgba(201,168,76,.3)'}}>
                <QRMini value={`https://${profileUrl}`} size={100}/>
              </div>
            </div>
            <div style={{background:'white',borderRadius:6,padding:5,marginBottom:6}}>
              <Barcode value={creator.code} w={160} h={36}/>
            </div>
            <div style={{fontFamily:"'DM Mono',monospace",fontSize:8,color:'rgba(255,255,255,.3)'}}>creator/{username}</div>
          </div>

          <div style={{background:'#080C14',border:'1px solid rgba(0,212,255,.2)',borderRadius:16,padding:20,textAlign:'center'}}>
            <div style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:'#00D4FF',textTransform:'uppercase',letterSpacing:'.15em',marginBottom:12}}>B2B Referral</div>
            <div style={{display:'flex',justifyContent:'center',marginBottom:10}}>
              <div style={{background:'white',padding:8,borderRadius:10,boxShadow:'0 0 20px rgba(0,212,255,.25)'}}>
                <QRMini value={`https://${joinUrl}`} size={100}/>
              </div>
            </div>
            <div style={{background:'rgba(0,212,255,.08)',border:'1px solid rgba(0,212,255,.2)',borderRadius:8,padding:'8px 10px',marginTop:6}}>
              <div style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:'#00D4FF'}}>🎁 1 Monat Bronze gratis</div>
              <div style={{fontFamily:"'DM Mono',monospace",fontSize:8,color:'rgba(255,255,255,.3)',marginTop:2}}>Wer scannt → sofort aktiv</div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <Link href={`/join/${username}`}
          style={{display:'block',textAlign:'center',padding:'14px',background:'linear-gradient(135deg,#00D4FF,#0070F3)',borderRadius:14,color:'#000',fontFamily:"'Syne',sans-serif",fontWeight:900,fontSize:15,textDecoration:'none',boxShadow:'0 0 30px rgba(0,212,255,.25)'}}>
          🚀 Auch Creator werden → Kostenlos starten
        </Link>
        <div style={{textAlign:'center',marginTop:10,fontFamily:"'DM Mono',monospace",fontSize:9,color:'rgba(255,255,255,.2)'}}>
          🔒 DSGVO · 🇩🇪 Server DE · Kein Kreditkarte nötig
        </div>
      </div>
    </div>
  );
}
