import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Dashboard from "@/components/Dashboard";

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*, tenants:default_tenant_id(*)")
    .eq("id", user.id)
    .single();

  const { data: userTenants } = await supabase
    .from("user_tenants")
    .select("*, tenant:tenant_id(*)")
    .eq("user_id", user.id);

  const tenantId = profile?.default_tenant_id;

  const { data: tenantApps } = await supabase
    .from("tenant_apps")
    .select("*, app:app_id(*)")
    .eq("tenant_id", tenantId);

  const { data: allApps } = await supabase
    .from("apps")
    .select("*")
    .eq("is_active", true);

  return (
    <Dashboard
      user={user}
      profile={profile}
      userTenants={userTenants || []}
      tenantApps={tenantApps || []}
      allApps={allApps || []}
    />
  );
}
