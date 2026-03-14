import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Sidebar from "@/components/Sidebar";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: userTenant } = await supabase
    .from("user_tenants")
    .select("tenant_id")
    .eq("user_id", user.id)
    .single();

  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("plan")
    .eq("tenant_id", userTenant?.tenant_id ?? "")
    .single();

  return (
    <div className="min-h-screen bg-zinc-950 text-yellow-50 flex">
      <Sidebar user={user} plan={subscription?.plan ?? "free"} />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
