import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Sidebar from "@/components/Sidebar";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Get plan from profiles table (source of truth)
  const { data: profile } = await supabase
    .from("profiles")
    .select("plan_id")
    .eq("id", user.id)
    .single();

  return (
    <div className="min-h-screen bg-zinc-950 text-yellow-50 flex">
      <Sidebar user={user} plan={profile?.plan_id ?? "gratis"} />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}

