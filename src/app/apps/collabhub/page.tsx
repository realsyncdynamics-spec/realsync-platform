import AppLandingPage from '@/components/AppLandingPage';
import { Users, MessageCircle, GitBranch, Award } from 'lucide-react';

export default function CollabHubPage() {
  return (
    <AppLandingPage
      appName="CollabHub"
      headline="Collab Hub"
      subtitle="Creator Collaboration // Deal Management // Contract Automation"
      accentColor="#F59E0B"
      ctaText="Collabs Starten"
      features={[
        { icon: <Users size={20} />, title: 'Creator Matching', desc: 'KI-basiertes Matching mit passenden Creators' },
        { icon: <MessageCircle size={20} />, title: 'Deal Chat', desc: 'Integrierter Chat fuer Verhandlungen' },
        { icon: <GitBranch size={20} />, title: 'Workflow', desc: 'Automatisierte Collaboration-Workflows' },
        { icon: <Award size={20} />, title: 'Contracts', desc: 'Automatische Vertragsvorlagen und Signing' },
      ]}
      plans={[
        { id: 'free', name: 'Free', price: 0, features: ['3 Collabs/Monat', 'Basic Chat'] },
        { id: 'bronze', name: 'Bronze', price: 4.99, features: ['25 Collabs/Monat', 'Deal Templates', 'Analytics'] },
        { id: 'gold', name: 'Gold', price: 29.99, features: ['Unbegrenzt', 'Contract Automation', 'Priority Matching'] },
      ]}
    />
  );
}
