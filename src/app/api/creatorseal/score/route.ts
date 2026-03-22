import { NextRequest, NextResponse } from 'next/server';
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const handle = searchParams.get('handle') || '@creator';
  const seed = handle.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  return NextResponse.json({
    handle, score: 65+(seed%30), change:`+${5+(seed%20)}`, verified:seed%3===0,
    trustFactors:[
      {icon:'🛡',label:'C2PA 2.3',       score:85+(seed%15),color:'#10B981',desc:'Content signiert'},
      {icon:'⛓',label:'Blockchain',      score:80+(seed%18),color:'#8B5CF6',desc:'Polygon verankert'},
      {icon:'🤖',label:'Deepfake-Scan',  score:95+(seed%5), color:'#00D4FF',desc:'KI-verifiziert'},
      {icon:'📸',label:'Style-Check',    score:60+(seed%30),color:'#C9A84C',desc:'Brand-Cohesion'},
      {icon:'📊',label:'Engagement',     score:55+(seed%35),color:'#F59E0B',desc:'Authentic ratio'},
      {icon:'🎯',label:'Brand-Fitness',  score:70+(seed%25),color:'#EC4899',desc:'Deal-bereit'},
    ],
  });
}
