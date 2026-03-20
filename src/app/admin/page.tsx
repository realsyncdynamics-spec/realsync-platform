import AdminDashboard from '@/components/AdminDashboard';

export const metadata = {
  title: 'Admin Command Center | RealSyncDynamics',
};

export default function AdminPage() {
  return (
    <div className="p-8 md:p-12">
      <div className="mb-10 flex justify-between items-end">
        <div>
          <p className="text-[10px] font-mono text-[#C9A84C] uppercase tracking-[0.5em] mb-2">Ecosystem Intelligence</p>
          <h1 className="text-4xl font-black italic uppercase tracking-tighter">Command Dashboard</h1>
        </div>
        <div className="text-right">
          <span className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 px-4 py-1 rounded-full">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-[10px] font-mono text-green-500 uppercase font-bold">All Systems Nominal</span>
          </span>
        </div>
      </div>
      <AdminDashboard />
    </div>
  );
}
