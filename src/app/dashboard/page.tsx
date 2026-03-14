import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import DashboardClient from "@/components/DashboardClient";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Get tenant
  const { data: userTenant } = await supabase
    .from("user_tenants")
    .select("tenant_id, tenants(*)")
    .eq("user_id", user.id)
    .single();

  // Get post stats
  const { count: totalPosts } = await supabase
    .from("posts")
    .select("*", { count: "exact", head: true })
    .eq("tenant_id", userTenant?.tenant_id ?? "");

  const { count: publishedPosts } = await supabase
    .from("posts")
    .select("*", { count: "exact", head: true })
    .eq("tenant_id", userTenant?.tenant_id ?? "")
    .eq("status", "published");

  const { count: scheduledPosts } = await supabase
    .from("posts")
    .select("*", { count: "exact", head: true })
    .eq("tenant_id", userTenant?.tenant_id ?? "")
    .eq("status", "scheduled");

  const { count: socialAccounts } = await supabase
    .from("social_accounts")
    .select("*", { count: "exact", head: true })
    .eq("tenant_id", userTenant?.tenant_id ?? "");

  // Get subscription
  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("tenant_id", userTenant?.tenant_id ?? "")
    .single();

  // Get recent posts
  const { data: recentPosts } = await supabase
    .from("posts")
    .select("*")
    .eq("tenant_id", userTenant?.tenant_id ?? "")
    .order("created_at", { ascending: false })
    .limit(5);

  return (
    <DashboardClient
      user={user}
      stats={{
        totalPosts: totalPosts ?? 0,
        publishedPosts: publishedPosts ?? 0,
        scheduledPosts: scheduledPosts ?? 0,
        socialAccounts: socialAccounts ?? 0,
      }}
      subscription={subscription}
      recentPosts={recentPosts ?? []}
      tenantId={userTenant?.tenant_id ?? ""}
    />
  );
}
