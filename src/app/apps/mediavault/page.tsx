import AppLandingPage from '@/components/AppLandingPage';
import { Database, Cloud, Lock, Zap } from 'lucide-react';

export default function MediaVaultPage() {
  return (
    <AppLandingPage
      appName="MediaVault"
      headline="Media Vault"
      subtitle="Sicherer Cloud-Speicher // Versionierung // Blockchain-Backup"
      accentColor="#8B5CF6"
      ctaText="Dateien Sichern"
      features={[
        { icon: <Database size={20} />, title: 'Cloud Storage', desc: 'Unbegrenzter verschluesselter Speicher fuer alle Medien' },
        { icon: <Cloud size={20} />, title: 'Auto-Backup', desc: 'Automatische Sicherung mit Versionskontrolle' },
        { icon: <Lock size={20} />, title: 'Encryption', desc: 'End-to-End Verschluesselung fuer maximale Sicherheit' },
        { icon: <Zap size={20} />, title: 'Quick Access', desc: 'Blitzschneller Zugriff auf alle Dateien weltweit' },
      ]}
      plans={[
        { id: 'free', name: 'Free', price: 0, features: ['5 GB Speicher', 'Basic Backup'] },
        { id: 'bronze', name: 'Bronze', price: 4.99, features: ['50 GB Speicher', 'Auto-Backup', 'Versionierung'] },
        { id: 'gold', name: 'Gold', price: 29.99, features: ['Unbegrenzt', 'Blockchain-Backup', 'Priority CDN'] },
      ]}
    />
  );
}
