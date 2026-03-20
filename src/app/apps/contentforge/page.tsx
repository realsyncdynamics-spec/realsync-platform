import AppLandingPage from '@/components/app-template/AppLandingPage';
import { PenTool, Globe, Search, Languages } from 'lucide-react';

export default function ContentForgePage() {
  return (
    <AppLandingPage
      appName="ContentForge"
      headline="Content Forge"
      subtitle="KI Content Generator // Blog Posts // Social Captions // SEO"
      accentColor="#A78BFA"
      ctaText="Content Generieren"
      features={[
        { icon: <PenTool size={20} />, title: 'Blog Posts', desc: 'SEO-optimierte Artikel in Minuten' },
        { icon: <Globe size={20} />, title: 'Social Captions', desc: 'Plattform-spezifische Texte' },
        { icon: <Search size={20} />, title: 'SEO Engine', desc: 'Keyword-Analyse & Optimierung' },
        { icon: <Languages size={20} />, title: 'Multi-Language', desc: '12+ Sprachen mit KI-Uebersetzung' },
      ]}
      plans={[
        { id: 'free', name: 'Free', price: 0, features: ['5 Generierungen/Tag', 'Standard Qualitaet'] },
        { id: 'bronze', name: 'Bronze', price: 4.99, features: ['30 Generierungen/Tag', 'Tone Config', 'SEO Tools'] },
        { id: 'gold', name: 'Gold', price: 29.99, features: ['Unbegrenzt', 'Multi-Language', 'API Zugang'] },
      ]}
    />
  );
}
