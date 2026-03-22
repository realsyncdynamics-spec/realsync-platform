import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// Perplexity Spaces — Persistente Research-Workspaces
// Jeder Space hat: Name, Kontext, gespeicherte Gespräche, Citations
// Vorerst localStorage/Supabase-backed, später Perplexity Spaces API

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Nicht eingeloggt' }, { status: 401 });

  const { data: spaces } = await supabase
    .from('optimus_spaces')
    .select('*')
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false });

  return NextResponse.json({ spaces: spaces || [] });
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Nicht eingeloggt' }, { status: 401 });

  const { name, context, app } = await request.json();

  const { data, error } = await supabase
    .from('optimus_spaces')
    .insert({ user_id: user.id, name, context, app, messages: [], created_at: new Date().toISOString(), updated_at: new Date().toISOString() })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ space: data });
}
