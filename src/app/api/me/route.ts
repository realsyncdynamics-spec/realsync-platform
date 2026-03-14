import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single();
  const { data: tenants } = await supabase.from("user_tenants").select("*, tenant:tenant_id(*)").eq("user_id", user.id);

  return NextResponse.json({ user, profile, tenants });
}
