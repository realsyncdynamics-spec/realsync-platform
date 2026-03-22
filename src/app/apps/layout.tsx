import MobileNav from '@/components/MobileNav';
export default function AppsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <div className="pb-20 lg:pb-0"/>
      <MobileNav/>
    </>
  );
}
