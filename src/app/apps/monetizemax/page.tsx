import AppLandingPage from '@/components/AppLandingPage';
import { DollarSign, TrendingUp, CreditCard, PieChart } from 'lucide-react';

export default function MonetizeMaxPage() {
  return (
    <AppLandingPage
      appName="MonetizeMax"
      headline="Monetize Max"
      subtitle="Revenue Optimization // Multi-Stream Income // Payment Analytics"
      accentColor="#10B981"
      ctaText="Revenue Steigern"
      features={[
        { icon: <DollarSign size={20} />, title: 'Revenue Streams', desc: 'Mehrere Einnahmequellen intelligent verwalten' },
        { icon: <TrendingUp size={20} />, title: 'Growth Analytics', desc: 'Echtzeit-Umsatzanalyse und Prognosen' },
        { icon: <CreditCard size={20} />, title: 'Payment Hub', desc: 'Alle Zahlungen zentral an einem Ort' },
        { icon: <PieChart size={20} />, title: 'Split Testing', desc: 'A/B-Tests fuer optimale Monetarisierung' },
      ]}
      plans={[
        { id: 'free', name: 'Free', price: 0, features: ['Basic Analytics', '1 Revenue Stream'] },
        { id: 'bronze', name: 'Bronze', price: 4.99, features: ['5 Revenue Streams', 'Payment Hub', 'Reports'] },
        { id: 'gold', name: 'Gold', price: 29.99, features: ['Unbegrenzt', 'Split Testing', 'Forecasting AI'] },
      ]}
    />
  );
}
