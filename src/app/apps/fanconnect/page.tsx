import AppLandingPage from '@/components/AppLandingPage';
import { Heart, Mail, Gift, Star } from 'lucide-react';

export default function FanConnectPage() {
  return (
    <AppLandingPage
      appName="FanConnect"
      headline="Fan Connect"
      subtitle="Community Management // Fan Engagement // Loyalty Rewards"
      accentColor="#EF4444"
      ctaText="Community Aufbauen"
      features={[
        { icon: <Heart size={20} />, title: 'Fan Dashboard', desc: 'Alle Fans und Interaktionen auf einen Blick' },
        { icon: <Mail size={20} />, title: 'Direct Messages', desc: 'Personalisierte Nachrichten an Top-Fans' },
        { icon: <Gift size={20} />, title: 'Rewards', desc: 'Loyalty-Programm mit automatischen Belohnungen' },
        { icon: <Star size={20} />, title: 'VIP Tiers', desc: 'Exklusive Stufen fuer die treuesten Fans' },
      ]}
      plans={[
        { id: 'free', name: 'Free', price: 0, features: ['100 Fans', 'Basic Dashboard'] },
        { id: 'bronze', name: 'Bronze', price: 4.99, features: ['5000 Fans', 'Direct Messages', 'Rewards'] },
        { id: 'gold', name: 'Gold', price: 29.99, features: ['Unbegrenzt', 'VIP Tiers', 'Custom Branding'] },
      ]}
    />
  );
}
