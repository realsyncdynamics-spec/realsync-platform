import AppLandingPage from '@/components/AppLandingPage';
import { Calendar, Clock, Bell, Repeat } from 'lucide-react';

export default function ScheduleMasterPage() {
  return (
    <AppLandingPage
      appName="ScheduleMaster"
      headline="Schedule Master"
      subtitle="KI-Content Planer // Auto-Posting // Best-Time Optimization"
      accentColor="#F97316"
      ctaText="Planer Starten"
      features={[
        { icon: <Calendar size={20} />, title: 'Content Calendar', desc: 'Visueller Kalender fuer alle Plattformen' },
        { icon: <Clock size={20} />, title: 'Best Time AI', desc: 'KI ermittelt optimale Posting-Zeiten' },
        { icon: <Bell size={20} />, title: 'Reminders', desc: 'Automatische Erinnerungen und Deadlines' },
        { icon: <Repeat size={20} />, title: 'Auto-Post', desc: 'Automatisches Posting auf allen Kanaelen' },
      ]}
      plans={[
        { id: 'free', name: 'Free', price: 0, features: ['10 Posts/Monat', '2 Plattformen'] },
        { id: 'bronze', name: 'Bronze', price: 4.99, features: ['100 Posts/Monat', '5 Plattformen', 'Best Time AI'] },
        { id: 'gold', name: 'Gold', price: 29.99, features: ['Unbegrenzt', 'Auto-Post', 'Team Kalender'] },
      ]}
    />
  );
}
