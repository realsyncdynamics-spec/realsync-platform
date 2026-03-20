import AppLandingPage from '@/components/AppLandingPage';
import { BarChart3, Activity, Eye, Target } from 'lucide-react';

export default function AnalyticsProPage() {
  return (
    <AppLandingPage
      appName="AnalyticsPro"
      headline="Analytics Pro"
      subtitle="Cross-Platform Analytics // KI-Insights // Performance Tracking"
      accentColor="#6366F1"
      ctaText="Analytics Starten"
      features={[
        { icon: <BarChart3 size={20} />, title: 'Dashboard', desc: 'Alle Plattformen in einem einzigen Dashboard' },
        { icon: <Activity size={20} />, title: 'Real-Time', desc: 'Echtzeit-Metriken ueber alle Kanaele' },
        { icon: <Eye size={20} />, title: 'KI-Insights', desc: 'Automatische Erkenntnisse und Empfehlungen' },
        { icon: <Target size={20} />, title: 'Goals', desc: 'Ziel-Tracking mit automatischen Benachrichtigungen' },
      ]}
      plans={[
        { id: 'free', name: 'Free', price: 0, features: ['2 Plattformen', 'Basic Charts'] },
        { id: 'bronze', name: 'Bronze', price: 4.99, features: ['10 Plattformen', 'KI-Insights', 'Export'] },
        { id: 'gold', name: 'Gold', price: 29.99, features: ['Unbegrenzt', 'Custom Reports', 'API Access'] },
      ]}
    />
  );
}
