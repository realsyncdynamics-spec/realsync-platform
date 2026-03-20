import AppLandingPage from '@/components/app-template/AppLandingPage';
import { Shield, Search, FileText, Scale } from 'lucide-react';

export default function RightsGuardPage() {
  return (
    <AppLandingPage
      appName="RightsGuard"
      headline="Rights Guard"
      subtitle="Digital Rights Management // DMCA // Blockchain Proof"
      accentColor="#2DD4BF"
      ctaText="Content Schuetzen"
      features={[
        { icon: <Search size={20} />, title: 'Reverse Image Search', desc: 'Finde illegale Kopien deiner Inhalte' },
        { icon: <FileText size={20} />, title: 'DMCA Generator', desc: 'Automatische Takedown-Notices' },
        { icon: <Shield size={20} />, title: 'Copyright Monitor', desc: '24/7 Web-Ueberwachung' },
        { icon: <Scale size={20} />, title: 'Legal Templates', desc: 'Rechtssichere Vorlagen' },
      ]}
      plans={[
        { id: 'free', name: 'Free', price: 0, features: ['5 Scans/Tag', 'Basic Monitoring'] },
        { id: 'bronze', name: 'Bronze', price: 4.99, features: ['25 Scans/Tag', 'DMCA Generator'] },
        { id: 'gold', name: 'Gold', price: 29.99, features: ['Unbegrenzt', 'Legal Templates', 'Blockchain Proof'] },
      ]}
    />
  );
}
