import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: true, message: 'Nicht eingeloggt', code: 'UNAUTHORIZED' },
        { status: 401 }
      );
    }
    const { data, error } = await supabase
      .from("user_tenants")
      .select("*, tenant:tenant_id(*)")
      .eq("user_id", user.id);

    if (error) {
      return NextResponse.json(
        { error: true, message: 'Tenants konnten nicht geladen werden', code: 'TENANTS_FETCH_FAILED' },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (err: any) {
    console.error('[Tenants]', err);
    return NextResponse.json(
      { error: true, message: err.message || 'Serverfehler', code: 'INTERNAL_ERROR' },
      { status: 500 }
    );
  }
}
