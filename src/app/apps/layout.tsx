import MobileNav from '@/components/MobileNav';
import OptimusButton from '@/components/OptimusButton';

export default function AppsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <OptimusButton app="Creator OS" />
      <div className="pb-20 lg:pb-0"/>
      <MobileNav/>
    </>
  );
}
