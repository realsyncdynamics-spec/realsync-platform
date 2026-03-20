import AppLandingPage from '@/components/AppLandingPage';
import { Palette, Image, Type, Sparkles } from 'lucide-react';

export default function BrandKitPage() {
  return (
    <AppLandingPage
      appName="BrandKit"
      headline="Brand Kit"
      subtitle="KI-Brand Identity // Logo Generator // Style Guide Automation"
      accentColor="#EC4899"
      ctaText="Brand Erstellen"
      features={[
        { icon: <Palette size={20} />, title: 'Brand Colors', desc: 'KI-generierte Farbpaletten passend zu deiner Marke' },
        { icon: <Image size={20} />, title: 'Logo Generator', desc: 'Professionelle Logos in Sekunden erstellen' },
        { icon: <Type size={20} />, title: 'Typography', desc: 'Automatische Font-Paarungen und Hierarchien' },
        { icon: <Sparkles size={20} />, title: 'Style Guide', desc: 'Komplette Brand Guidelines automatisch generiert' },
      ]}
      plans={[
        { id: 'free', name: 'Free', price: 0, features: ['1 Brand Profil', 'Basic Logo'] },
        { id: 'bronze', name: 'Bronze', price: 4.99, features: ['5 Brand Profile', 'Logo Varianten', 'Farbpaletten'] },
        { id: 'gold', name: 'Gold', price: 29.99, features: ['Unbegrenzt', 'Style Guide Export', 'White-Label'] },
      ]}
    />
  );
}
